from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import uvicorn
import os
import asyncio
import time
from datetime import datetime
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Text Tools Service",
    description="Fast text processing and manipulation service",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for type safety
class SortOptions(BaseModel):
    case_sensitive: bool = False
    remove_empty: bool = False
    remove_duplicates: bool = False

class SortRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text content to sort")
    method: str = Field(..., description="Sorting method")
    options: Optional[SortOptions] = None

class ProcessingStats(BaseModel):
    originalLines: int
    processedLines: int
    processingTime: int

class SortResponse(BaseModel):
    originalText: str
    processedText: str
    method: str
    options: dict = {}
    processedAt: str
    stats: ProcessingStats

class LogRequest(BaseModel):
    level: str = "info"
    message: str
    meta: Optional[dict] = None

class ExportRequest(BaseModel):
    originalText: str
    processedText: str
    method: str
    format: str = "simple"
    options: Optional[dict] = None

# Text processing logic
class TextProcessor:
    @staticmethod
    def sort_text(text: str, method: str, options: SortOptions = None) -> tuple[str, dict]:
        """Sort text using various methods with performance optimization"""
        start_time = time.time()
        
        # Split into lines and normalize line endings
        lines = text.replace('\r\n', '\n').replace('\r', '\n').split('\n')
        original_lines = len(lines)
        
        # Apply preprocessing options
        if options:
            if options.remove_empty:
                lines = [line for line in lines if line.strip()]
            if options.remove_duplicates:
                seen = set()
                if options.case_sensitive:
                    lines = [x for x in lines if not (x in seen or seen.add(x))]
                else:
                    lines = [x for x in lines if not (x.lower() in seen or seen.add(x.lower()))]
        
        # Sort based on method
        if method == "alphabetical-asc":
            lines.sort(reverse=False if not options or not options.case_sensitive else None, 
                      key=str.lower if not options or not options.case_sensitive else None)
        elif method == "alphabetical-desc":
            lines.sort(reverse=True if not options or not options.case_sensitive else None,
                      key=str.lower if not options or not options.case_sensitive else None)
        elif method == "natural-asc":
            import re
            def natural_key(s):
                return [int(text) if text.isdigit() else text.lower() for text in re.split('([0-9]+)', s)]
            lines.sort(key=natural_key)
        elif method == "natural-desc":
            import re
            def natural_key(s):
                return [int(text) if text.isdigit() else text.lower() for text in re.split('([0-9]+)', s)]
            lines.sort(key=natural_key, reverse=True)
        elif method == "length-asc":
            lines.sort(key=len)
        elif method == "length-desc":
            lines.sort(key=len, reverse=True)
        elif method == "reverse":
            lines.reverse()
        elif method == "shuffle":
            import random
            random.shuffle(lines)
        else:
            raise ValueError(f"Unknown sorting method: {method}")
        
        processed_text = '\n'.join(lines)
        processing_time = int((time.time() - start_time) * 1000)
        
        stats = {
            "originalLines": original_lines,
            "processedLines": len(lines),
            "processingTime": processing_time
        }
        
        return processed_text, stats

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "text-tools-service-py",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/sort")
async def sort_text(request: SortRequest):
    """Sort text using specified method and options"""
    try:
        logger.info(f"Processing sort request: method={request.method}, text_length={len(request.text)}")
        
        processed_text, stats = TextProcessor.sort_text(
            request.text, 
            request.method, 
            request.options or SortOptions()
        )
        
        # Match Express response format exactly
        response = {
            "success": True,
            "data": {
                "originalText": request.text,
                "processedText": processed_text,
                "method": request.method,
                "options": request.options.dict() if request.options else {},
                "processedAt": datetime.now().isoformat(),
                "stats": {
                    "originalLines": stats["originalLines"],
                    "processedLines": stats["processedLines"],
                    "processingTime": stats["processingTime"]
                }
            },
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Sort completed: {stats['processingTime']}ms, {stats['processedLines']} lines")
        return response
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return {
            "success": False,
            "error": "Internal server error",
            "timestamp": datetime.now().isoformat()
        }

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    method: str = "alphabetical-asc",
    case_sensitive: bool = False,
    remove_empty: bool = False,
    remove_duplicates: bool = False
):
    """Sort uploaded text file"""
    try:
        # Validate file size (10MB limit)
        if file.size and file.size > 10 * 1024 * 1024:
            return {
                "success": False,
                "error": "File size exceeds 10MB limit",
                "timestamp": datetime.now().isoformat()
            }
        
        # Read file content
        content = await file.read()
        text = content.decode('utf-8')
        
        # Create options
        options = SortOptions(
            case_sensitive=case_sensitive,
            remove_empty=remove_empty,
            remove_duplicates=remove_duplicates
        )
        
        # Process text
        processed_text, stats = TextProcessor.sort_text(text, method, options)
        
        # Match Express response format exactly
        response = {
            "success": True,
            "data": {
                "originalText": text,
                "processedText": processed_text,
                "method": method,
                "options": options.dict(),
                "processedAt": datetime.now().isoformat(),
                "stats": {
                    "originalLines": stats["originalLines"],
                    "processedLines": stats["processedLines"],
                    "processingTime": stats["processingTime"]
                }
            },
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"File sort completed: {file.filename}, {stats['processingTime']}ms")
        return response
        
    except UnicodeDecodeError:
        return {
            "success": False,
            "error": "File must be valid UTF-8 text",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"File processing error: {str(e)}")
        return {
            "success": False,
            "error": "File processing error",
            "timestamp": datetime.now().isoformat()
        }

@app.post("/log")
async def frontend_log(request: LogRequest):
    """Frontend logging endpoint"""
    try:
        # Log the frontend message with appropriate level
        if request.level.lower() == "error":
            logger.error(f"[FRONTEND] {request.message}: {request.meta}")
        elif request.level.lower() == "warn":
            logger.warning(f"[FRONTEND] {request.message}: {request.meta}")
        elif request.level.lower() == "debug":
            logger.debug(f"[FRONTEND] {request.message}: {request.meta}")
        else:
            logger.info(f"[FRONTEND] {request.message}: {request.meta}")
        
        return {"success": True}
    except Exception as e:
        logger.error(f"Frontend logging error: {str(e)}")
        return {"success": False, "error": "Logging failed"}

@app.post("/export/csv")
async def export_csv(request: ExportRequest):
    """Export text data to CSV format"""
    try:
        import io
        import csv
        
        # Create CSV content
        output = io.StringIO()
        
        if request.format == "simple":
            writer = csv.writer(output)
            lines = request.processedText.split('\n')
            for line in lines:
                writer.writerow([line])
        elif request.format == "comparison":
            writer = csv.writer(output)
            writer.writerow(["Original", "Processed", "Line Number"])
            original_lines = request.originalText.split('\n')
            processed_lines = request.processedText.split('\n')
            max_lines = max(len(original_lines), len(processed_lines))
            
            for i in range(max_lines):
                orig = original_lines[i] if i < len(original_lines) else ""
                proc = processed_lines[i] if i < len(processed_lines) else ""
                writer.writerow([orig, proc, i + 1])
        else:
            raise ValueError(f"Unknown export format: {request.format}")
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"text-export-{timestamp}.csv"
        
        csv_content = output.getvalue()
        output.close()
        
        logger.info(f"CSV export completed: {filename}, {len(csv_content)} bytes")
        
        from fastapi.responses import Response
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        logger.error(f"CSV export error: {str(e)}")
        raise HTTPException(status_code=500, detail="CSV export failed")

@app.get("/")
async def root():
    """Root endpoint with service info"""
    return {
        "service": "Text Tools Service",
        "version": "2.0.0",
        "framework": "FastAPI",
        "endpoints": {
            "health": "/health",
            "sort": "/sort",
            "upload": "/upload",
            "export_csv": "/export/csv",
            "docs": "/docs"
        }
    }

# Auto-generate OpenAPI docs at /docs
if __name__ == "__main__":
    port = int(os.getenv("PORT", 3001))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("NODE_ENV") == "development" else False,
        log_level="info"
    )

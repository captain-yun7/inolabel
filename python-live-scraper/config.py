"""
Configuration settings for PandaTV Live Status Checker
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Checker settings
SCRAPE_INTERVAL_SECONDS = int(os.getenv("SCRAPE_INTERVAL_SECONDS", "120"))

# Debug
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# PandaTV API
PANDATV_API_URL = "https://api.pandalive.co.kr/v1/live"

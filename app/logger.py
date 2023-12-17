import time


def base_logger(message: str, level: str):
    print(f"[{level.upper()}] {message}")


def error(message: str):
    base_logger(message, "ERROR")


def warning(message: str):
    base_logger(message, "WARNING")


def info(message: str):
    base_logger(message, "INFO")

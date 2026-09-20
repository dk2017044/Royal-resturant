#!/usr/bin/env python3
"""
Bulk AI Image Generator (100% Free API Setup)
==============================================
Supports 100% free unlimited bulk image generation via Pollinations AI
Zero API key required, zero signup, zero rate limits.

Usage:
------
1. Interactive Mode:
   python scripts/bulk_image_generator.py

2. From a text file (one prompt per line):
   python scripts/bulk_image_generator.py --prompts-file prompts.txt --output ./generated_images

3. Directly for Royal Rasoi Menu Dishes:
   python scripts/bulk_image_generator.py --from-menu --count 10 --output ./generated_images/dishes

4. Custom prompt directly from CLI:
   python scripts/bulk_image_generator.py --prompt "authentic royal awadhi dum biryani in earthen handi" --filename biryani.jpg
"""

import os
import sys
import json
import time
import urllib.parse
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Default Configuration
DEFAULT_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "generated_images")
DEFAULT_WIDTH = 768
DEFAULT_HEIGHT = 768
MAX_WORKERS = 3  # Concurrency limit for smooth downloads
MAX_RETRIES = 3

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def sanitize_filename(name: str) -> str:
    """Sanitize string to create a valid filename."""
    keepchars = ("-", "_", ".")
    clean = "".join(c for c in name if c.isalnum() or c in keepchars or c == " ").strip()
    return clean.replace(" ", "_").lower()


def generate_single_image_pollinations(
    prompt: str,
    output_path: str,
    width: int = DEFAULT_WIDTH,
    height: int = DEFAULT_HEIGHT,
    seed: int = None,
    enhance: bool = True,
) -> bool:
    """
    Generate an image using Pollinations.ai (100% Free, No API Key needed).
    """
    final_prompt = prompt
    if enhance and not any(k in prompt.lower() for k in ["4k", "photorealistic", "photography"]):
        final_prompt = f"{prompt}, professional food photography, 8k resolution, cinematic royal warm lighting, shallow depth of field, award winning commercial photo"

    encoded_prompt = urllib.parse.quote(final_prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true"
    if seed is not None:
        url += f"&seed={seed}"

    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"  [Attempt {attempt}/{MAX_RETRIES}] Generating: '{prompt[:50]}...'")
            with urllib.request.urlopen(req, timeout=60) as response:
                if response.status == 200:
                    data = response.read()
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    with open(output_path, "wb") as f:
                        f.write(data)
                    print(f"  [SUCCESS] Saved to: {os.path.basename(output_path)} ({len(data) // 1024} KB)")
                    return True
                else:
                    print(f"  [WARN] Status {response.status}, retrying...")
        except urllib.error.HTTPError as e:
            print(f"  [WARN] HTTP Error {e.code}: {e.reason}")
        except Exception as e:
            print(f"  [WARN] Error: {e}")

        time.sleep(2 * attempt)

    print(f"  [FAILED] Failed after {MAX_RETRIES} attempts: '{prompt[:50]}'")
    return False


def batch_generate_from_list(tasks, output_dir, width=DEFAULT_WIDTH, height=DEFAULT_HEIGHT, workers=MAX_WORKERS):
    """
    Generate multiple images in parallel with a thread pool.
    tasks: list of (prompt, filename) tuples
    """
    os.makedirs(output_dir, exist_ok=True)
    total = len(tasks)
    print(f"\n========================================================")
    print(f" Starting Bulk Image Generation ({total} images)")
    print(f" Output Directory: {os.path.abspath(output_dir)}")
    print(f" Concurrency: {workers} threads")
    print(f"========================================================\n")

    start_time = time.time()
    successful = 0
    failed = 0

    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_to_task = {}
        for idx, (prompt, fname) in enumerate(tasks, 1):
            out_file = os.path.join(output_dir, fname)
            future = executor.submit(
                generate_single_image_pollinations,
                prompt=prompt,
                output_path=out_file,
                width=width,
                height=height,
            )
            future_to_task[future] = (idx, prompt, fname)

        for future in as_completed(future_to_task):
            idx, prompt, fname = future_to_task[future]
            try:
                success = future.result()
                if success:
                    successful += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"  ! Exception for task {idx}: {e}")
                failed += 1

            completed = successful + failed
            print(f"--> Progress: {completed}/{total} (Success: {successful}, Failed: {failed})\n")

    elapsed = round(time.time() - start_time, 1)
    print(f"========================================================")
    print(f" Completed in {elapsed}s | Success: {successful}/{total} | Failed: {failed}")
    print(f" Images saved in: {os.path.abspath(output_dir)}")
    print(f"========================================================\n")


def run_from_menu(menu_json_path, output_dir, count=10):
    """Generate images for dishes from the restaurant's menu json."""
    if not os.path.exists(menu_json_path):
        print(f"Error: Menu file not found at {menu_json_path}")
        return

    with open(menu_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    dishes = data.get("food_menu", [])
    if count and count > 0:
        dishes = dishes[:count]

    tasks = []
    for dish in dishes:
        name = dish.get("item_name", "Dish")
        category = dish.get("category", "")
        desc = dish.get("description", "")
        prompt = f"Royal Indian restaurant dish: {name}, {category}. {desc}. Authentic fine dining plating, garnish with fresh herbs, gold and copper tableware, dark ambient luxury restaurant lighting"
        fname = f"{sanitize_filename(name)}.jpg"
        tasks.append((prompt, fname))

    batch_generate_from_list(tasks, output_dir)


def run_from_file(file_path, output_dir):
    """Generate images from a text file (one prompt per line or 'filename: prompt')."""
    if not os.path.exists(file_path):
        print(f"Error: Prompts file not found at {file_path}")
        return

    tasks = []
    with open(file_path, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]

    for idx, line in enumerate(lines, 1):
        if ":" in line and not line.startswith("http"):
            parts = line.split(":", 1)
            fname = parts[0].strip()
            if not fname.endswith((".jpg", ".png", ".webp")):
                fname += ".jpg"
            prompt = parts[1].strip()
        else:
            fname = f"image_{idx:03d}.jpg"
            prompt = line

        tasks.append((prompt, fname))

    batch_generate_from_list(tasks, output_dir)


def interactive_mode():
    """Interactive CLI menu for the user."""
    print("\n========================================================")
    print("  ROYAL RASOI - FREE BULK AI IMAGE GENERATOR")
    print("  Powered by Pollinations AI (100% Free, No Key Required)")
    print("========================================================")
    print("1. Generate images for Royal Rasoi Menu Dishes (from JSON)")
    print("2. Enter custom prompts interactively")
    print("3. Load prompts from a text file")
    print("4. Quick single image generation")
    print("5. Exit")

    choice = input("\nSelect an option (1-5): ").strip()

    if choice == "1":
        count_str = input("How many dishes to generate? (e.g. 10 or 'all'): ").strip()
        count = None if count_str.lower() == "all" else int(count_str) if count_str.isdigit() else 10
        menu_path = os.path.join(os.path.dirname(__file__), "..", "data", "royal-rasoi.json")
        out_dir = os.path.join(os.path.dirname(__file__), "..", "generated_images", "menu_dishes")
        run_from_menu(menu_path, out_dir, count=count)

    elif choice == "2":
        prompts = []
        print("\nEnter prompts one by one (type 'done' or press Enter on empty line to finish):")
        while True:
            p = input(f"Prompt {len(prompts) + 1}: ").strip()
            if not p or p.lower() == "done":
                break
            fname = f"dish_{len(prompts) + 1:02d}_{sanitize_filename(p[:20])}.jpg"
            prompts.append((p, fname))

        if prompts:
            out_dir = os.path.join(os.path.dirname(__file__), "..", "generated_images", "custom")
            batch_generate_from_list(prompts, out_dir)
        else:
            print("No prompts entered.")

    elif choice == "3":
        file_path = input("Enter path to prompts file: ").strip()
        out_dir = os.path.join(os.path.dirname(__file__), "..", "generated_images")
        run_from_file(file_path, out_dir)

    elif choice == "4":
        p = input("Enter prompt: ").strip()
        if p:
            fname = input("Filename (default: output.jpg): ").strip() or "output.jpg"
            out_path = os.path.join(DEFAULT_OUTPUT_DIR, fname)
            generate_single_image_pollinations(p, out_path)
        else:
            print("Empty prompt.")

    else:
        print("Exiting.")


def main():
    parser = argparse.ArgumentParser(description="Bulk AI Image Generator (100% Free API)")
    parser.add_argument("--prompt", type=str, help="Single prompt to generate")
    parser.add_argument("--filename", type=str, default="output.jpg", help="Filename for single prompt")
    parser.add_argument("--prompts-file", type=str, help="Path to text file with prompts (1 per line)")
    parser.add_argument("--from-menu", action="store_true", help="Generate images from royal-rasoi.json")
    parser.add_argument("--count", type=int, default=10, help="Number of dishes to generate if using --from-menu")
    parser.add_argument("--output", type=str, default=DEFAULT_OUTPUT_DIR, help="Output directory")
    parser.add_argument("--width", type=int, default=DEFAULT_WIDTH, help="Image width")
    parser.add_argument("--height", type=int, default=DEFAULT_HEIGHT, help="Image height")
    parser.add_argument("--workers", type=int, default=MAX_WORKERS, help="Concurrent downloads")

    args = parser.parse_args()

    if args.prompt:
        out_file = os.path.join(args.output, args.filename)
        generate_single_image_pollinations(args.prompt, out_file, width=args.width, height=args.height)
    elif args.prompts_file:
        run_from_file(args.prompts_file, args.output)
    elif args.from_menu:
        menu_path = os.path.join(os.path.dirname(__file__), "..", "data", "royal-rasoi.json")
        run_from_menu(menu_path, args.output, count=args.count)
    else:
        interactive_mode()


if __name__ == "__main__":
    main()

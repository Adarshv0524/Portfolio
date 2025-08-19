import os
import sys

def combine_code_files(directory_path):
    """Reads all .py, .html, .css, .js files in the directory (recursively) and combines them into one text file."""
    output_folder = "zzz"
    os.makedirs(output_folder, exist_ok=True)

    # Get just the last folder name to use in output filename
    dir_name = os.path.basename(os.path.normpath(directory_path))
    output_filename = f"{dir_name}_combined.txt"
    output_file_path = os.path.join(output_folder, output_filename)

    if not os.path.isdir(directory_path):
        raise FileNotFoundError(f"Directory not found: {directory_path}")

    allowed_extensions = {".py", ".html", ".css", ".js"}

    with open(output_file_path, "w", encoding="utf-8") as outfile:
        for root, _, files in os.walk(directory_path):
            for filename in sorted(files):
                ext = os.path.splitext(filename)[1]
                if ext in allowed_extensions:
                    file_path = os.path.join(root, filename)
                    outfile.write(f"# ---- {file_path} ----\n")
                    try:
                        with open(file_path, "r", encoding="utf-8") as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"\n[Error reading {file_path}: {e}]\n")
                    outfile.write("\n" + "-" * 40 + "\n\n")

    print(f"✅ Combined file saved to: {output_file_path}")


if __name__ == "__main__":
    if len(sys.argv) >= 2:
        dir_path = sys.argv[1]
    else:
        dir_path = input("Enter the directory path: ").strip()

    combine_code_files(dir_path)

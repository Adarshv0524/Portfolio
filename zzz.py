import os
import sys
import csv

def combine_files(directory_path):
    """
    Reads files in the given directory and combines them into one text file.

    - If the directory is named 'android', it processes a specific list of
      Android project files.
    - Otherwise, it processes all readable text files, samples CSV/TSV,
      and skips specified directories and binary files.
    """
    output_folder = "zzz_combined_output"
    os.makedirs(output_folder, exist_ok=True)

    # Normalize path and get directory name for the output file
    norm_path = os.path.normpath(directory_path)
    dir_name = os.path.basename(norm_path)
    output_filename = f"{dir_name}_combined.txt"
    output_file_path = os.path.join(output_folder, output_filename)

    if not os.path.isdir(directory_path):
        raise FileNotFoundError(f"Directory not found: {directory_path}")

    # --- Helper function to write a file's content to the output ---
    def write_file_content(file_path, outfile):
        """A helper to write the content of a single file to the main output."""
        if not os.path.exists(file_path):
            print(f"⚠️  Skipping non-existent file: {file_path}")
            return

        outfile.write(f"# ---- Start of: {file_path} ----\n")
        try:
            with open(file_path, "r", encoding="utf-8") as infile:
                outfile.write(infile.read())
        except UnicodeDecodeError:
            outfile.write("[Skipped: Binary or unreadable file]\n")
        except Exception as e:
            outfile.write(f"[Unexpected error reading file: {e}]\n")
        outfile.write(f"\n# ---- End of: {file_path} ----\n")
        outfile.write("-" * 60 + "\n\n")

    with open(output_file_path, "w", encoding="utf-8") as outfile:
        # === SPECIAL LOGIC FOR 'android' FOLDER ===
        if dir_name.lower() == "android":
            print("▶️  Android mode activated. Processing specific project files...")

            # 1. List of specific, individual files relative to the root
            files_to_process = [
                'build.gradle',
                'settings.gradle',
                'gradle.properties',
                'local.properties',
                'gradle/wrapper/gradle-wrapper.properties',
                'app/src/main/AndroidManifest.xml'
            ]
            for f in files_to_process:
                full_path = os.path.join(directory_path, f)
                write_file_content(full_path, outfile)

            # 2. Process all specified file types within the 'res' directory
            res_path = os.path.join(directory_path, 'app', 'src', 'main', 'res')
            if os.path.isdir(res_path):
                print(f"▶️  Scanning directory: {res_path}")
                for root, _, files in os.walk(res_path):
                    for filename in sorted(files):
                        if filename.lower().endswith(('.xml', '.kt', '.kts')):
                            file_path = os.path.join(root, filename)
                            write_file_content(file_path, outfile)
            else:
                print(f"⚠️  Warning: 'res' directory not found at {res_path}")

        # === ORIGINAL GENERIC LOGIC FOR ALL OTHER FOLDERS (e.g., 'lib') ===
        else:
            print("▶️  Generic mode activated. Processing all readable files...")
            skip_dirs = {"node_modules", ".vscode", ".git", "build", "dist"}

            for root, dirs, files in os.walk(directory_path):
                # Modify dirs in-place to prevent os.walk from descending into them
                dirs[:] = [d for d in dirs if d not in skip_dirs]

                for filename in sorted(files):
                    if filename in skip_dirs:
                        continue

                    file_path = os.path.join(root, filename)
                    outfile.write(f"# ---- Start of: {file_path} ----\n")

                    try:
                        # --- CSV / TSV handling ---
                        if filename.lower().endswith((".csv", ".tsv")):
                            delimiter = "," if filename.lower().endswith(".csv") else "\t"
                            with open(file_path, "r", encoding="utf-8", newline="") as infile:
                                reader = csv.reader(infile, delimiter=delimiter)
                                rows_written = 0
                                for i, row in enumerate(reader):
                                    if i < 15:  # Sample limit
                                        outfile.write(delimiter.join(row) + "\n")
                                        rows_written += 1
                                    else:
                                        break
                                outfile.write(
                                    f"\n# [Note: Only first {rows_written} rows shown as a sample.]\n"
                                )
                        # --- Normal text file handling ---
                        else:
                            with open(file_path, "r", encoding="utf-8") as infile:
                                outfile.write(infile.read())

                    except UnicodeDecodeError:
                        outfile.write("[Skipped: Binary or unreadable file]\n")
                    except Exception as e:
                        outfile.write(f"[Unexpected error: {e}]\n")

                    outfile.write(f"\n# ---- End of: {file_path} ----\n")
                    outfile.write("-" * 60 + "\n\n")

    print(f"✅ Success! Combined file saved to: {output_file_path}")


if __name__ == "__main__":
    if len(sys.argv) >= 2:
        dir_path = sys.argv[1]
    else:
        dir_path = input("Enter the directory path to combine: ").strip()

    try:
        combine_files(dir_path)
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
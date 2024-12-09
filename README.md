## Cloning a Specific Directory

To clone only a single directory from this repository, follow these steps:

1. Clone the repository without downloading files:
   ```bash
   git clone --no-checkout https://github.com/Tharbouch/Toward-Secure-Code.git
   cd Toward-Secure-Code
   git sparse-checkout init
   ```
2. Specify the directory you want:
   
    ```bash
   git sparse-checkout set example-directory
   ```
3. Fetch the files:
   ```bash
   git checkout
   ```
After these steps, you'll have only the example-directory folder in your local machine.
This method ensures users don't need to download the entire repository if they only want a specific part.

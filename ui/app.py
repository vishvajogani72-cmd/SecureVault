
import customtkinter as ctk
from tkinter import messagebox
from services.vault_service import VaultService
from security.password_generator import generate_password
from security.password_strength import check_password_strength

class SecureVaultApp(ctk.CTk):

    def __init__(self):
        super().__init__()

        # Luxury Dark Theme
        self.colors = {
            "background": "#0B0B0D",
            "surface": "#151518",
            "surface_light": "#202024",
            "gold": "#D4AF6A",
            "gold_hover": "#E5C17B",
            "text": "#F5F5F5",
            "muted": "#A1A1AA",
            "border": "#303036",
            "success": "#4CAF83",
            "danger": "#E56B6F"
        }

        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("dark-blue")

        self.title("SecureVault | Personal Password Manager")
        self.geometry("1100x750")
        self.minsize(850, 600)

        self.configure(fg_color=self.colors["background"])

        self.vault = VaultService()

        self.current_credentials = []

        self.protocol("WM_DELETE_WINDOW", self.on_close)

        self.show_home_screen()

    # ---------------- COMMON METHODS ----------------
    def update_password_strength(self, password):
      strength = check_password_strength(password)

      colors = {
        "Weak": "#E56B6F",
        "Medium": "#E5AF45",
        "Strong": "#4CAF83",
        "Very Strong": "#D4AF6A"
    }

      self.strength_label.configure(
        text=f"Password Strength: {strength}",
        text_color=colors[strength]
    )
    def clear_screen(self):
        for widget in self.winfo_children():
            widget.destroy()

    def make_button(self, parent, text, command, width=160):
        return ctk.CTkButton(
            parent,
            text=text,
            command=command,
            width=width,
            height=42,
            fg_color=self.colors["gold"],
            hover_color=self.colors["gold_hover"],
            text_color="#111111",
            font=("Arial", 13, "bold"),
            corner_radius=10
        )

    def make_label(self, parent, text, size=14, color=None, bold=False):
        return ctk.CTkLabel(
            parent,
            text=text,
            font=("Arial", size, "bold" if bold else "normal"),
            text_color=color or self.colors["text"]
        )

    # ---------------- HOME SCREEN ----------------

    def show_home_screen(self):
        self.clear_screen()

        # Navigation
        nav = ctk.CTkFrame(
            self,
            fg_color=self.colors["surface"],
            corner_radius=0,
            height=75
        )
        nav.pack(fill="x")
        nav.pack_propagate(False)

        self.make_label(
            nav, "◆  SecureVault", 23,
            self.colors["gold"], True
        ).pack(side="left", padx=30)

        self.make_button(
            nav, "Sign In", self.open_signin, 110
        ).pack(side="right", padx=(10, 25), pady=15)

        self.make_button(
            nav, "Get Started", self.open_signup, 130
        ).pack(side="right", padx=5, pady=15)

        # Scrollable content
        content = ctk.CTkScrollableFrame(
            self,
            fg_color=self.colors["background"],
            corner_radius=0
        )
        content.pack(fill="both", expand=True)

        # Hero Section
        hero = ctk.CTkFrame(
            content,
            fg_color=self.colors["surface"],
            corner_radius=18
        )
        hero.pack(fill="x", padx=35, pady=30)

        self.make_label(
            hero, "YOUR DIGITAL SECURITY, REIMAGINED",
            12, self.colors["gold"], True
        ).pack(pady=(45, 12))

        self.make_label(
            hero, "One Vault. Every Password.",
            35, self.colors["text"], True
        ).pack(pady=8)

        self.make_label(
            hero,
            "Keep your digital identity secure in one private place.",
            16, self.colors["muted"]
        ).pack(pady=8)

        self.make_label(
            hero,
            "Encrypted storage  •  Local-first  •  Simple management",
            13, self.colors["gold"]
        ).pack(pady=10)

        self.make_button(
            hero, "Explore SecureVault",
            self.open_signup, 200
        ).pack(pady=(20, 45))

        # Features
        self.make_label(
            content, "Built for Your Digital Safety",
            25, self.colors["text"], True
        ).pack(pady=(25, 15))

        features = [
            (
                "AES-256-GCM Encryption",
                "Your saved passwords are encrypted before storage."
            ),
            (
                "Private Local Storage",
                "Your vault data is stored locally on your device."
            ),
            (
                "Easy Password Management",
                "Add, search, update and delete saved credentials."
            ),
            (
                "Master Password Protection",
                "Unlock your vault using your master password."
            )
        ]

        feature_frame = ctk.CTkFrame(
            content, fg_color="transparent"
        )
        feature_frame.pack(fill="x", padx=35, pady=10)

        for title, description in features:
            card = ctk.CTkFrame(
                feature_frame,
                fg_color=self.colors["surface"],
                corner_radius=14,
                border_width=1,
                border_color=self.colors["border"]
            )
            card.pack(fill="x", pady=8)

            self.make_label(
                card, "◆  " + title,
                17, self.colors["gold"], True
            ).pack(anchor="w", padx=22, pady=(18, 6))

            self.make_label(
                card, description,
                13, self.colors["muted"]
            ).pack(anchor="w", padx=22, pady=(0, 18))

        # How it works
        section = ctk.CTkFrame(
            content, fg_color=self.colors["surface"],
            corner_radius=15
        )
        section.pack(fill="x", padx=35, pady=25)

        self.make_label(
            section, "How SecureVault Works",
            23, self.colors["gold"], True
        ).pack(pady=(25, 15))

        steps = [
            "01  Create your vault with a strong master password.",
            "02  Unlock your private vault.",
            "03  Add your website credentials.",
            "04  Access and manage them whenever needed."
        ]

        for step in steps:
            self.make_label(
                section, step, 14, self.colors["text"]
            ).pack(anchor="w", padx=35, pady=8)

        ctk.CTkFrame(
            section, height=10, fg_color="transparent"
        ).pack()

        # Security note
        self.make_label(
            content, "Your master password is never stored directly.",
            14, self.colors["muted"]
        ).pack(pady=20)

        self.make_label(
            content, "SECUREVAULT  •  YOUR PRIVACY MATTERS",
            11, self.colors["gold"]
        ).pack(pady=(10, 30))

    # ---------------- SIGN UP ----------------

    def open_signup(self):
        if self.vault.db.vault_exists():
         messagebox.showinfo(
         "Vault Exists",
         "A vault is already registered. Please sign in."
         )
         self.show_login_screen()
        else:
            self.show_register_screen()

    def show_register_screen(self):
        self.clear_screen()

        frame = ctk.CTkFrame(
            self,
            fg_color=self.colors["surface"],
            corner_radius=20,
            width=430
        )
        frame.place(relx=0.5, rely=0.5, anchor="center")

        self.make_label(
            frame, "Create Your Vault",
            28, self.colors["gold"], True
        ).pack(pady=(35, 10))

        self.make_label(
            frame, "Set a strong master password",
            13, self.colors["muted"]
        ).pack(pady=5)

        self.register_password = ctk.CTkEntry(
            frame,
            width=320,
            height=45,
            placeholder_text="Master Password",
            show="*"
        )
        self.register_password.pack(pady=12)

        self.confirm_password = ctk.CTkEntry(
            frame,
            width=320,
            height=45,
            placeholder_text="Confirm Master Password",
            show="*"
        )
        self.confirm_password.pack(pady=12)

        self.make_button(
            frame, "Create Vault",
            self.register_vault, 320
        ).pack(pady=20)

        ctk.CTkButton(
            frame,
            text="Back to Home",
            command=self.show_home_screen,
            fg_color="transparent",
            hover_color=self.colors["surface_light"],
            text_color=self.colors["muted"]
        ).pack(pady=(0, 25))

    def register_vault(self):
        password = self.register_password.get()
        confirm = self.confirm_password.get()

        if not password or not confirm:
            messagebox.showwarning(
                "Missing Fields",
                "Please fill in both password fields."
            )
            return

        if password != confirm:
            messagebox.showerror(
                "Password Mismatch",
                "The passwords do not match."
            )
            return

        if len(password) < 12:
            messagebox.showwarning(
                "Weak Master Password",
                "Use at least 12 characters for your master password."
            )
            return

        result = self.vault.register_vault(password)

        if result:
            messagebox.showinfo(
                "Success",
                "Your vault has been created!"
            )
            self.show_login_screen()

    # ---------------- SIGN IN ----------------

    def open_signin(self):
        if self.vault.db.vault_exists():
            self.show_login_screen()
        else:
            messagebox.showinfo(
                "No Vault Found",
                "Please create your vault first."
            )
            self.show_register_screen()

    def show_login_screen(self):
        self.clear_screen()

        frame = ctk.CTkFrame(
            self,
            fg_color=self.colors["surface"],
            corner_radius=20,
            width=430
        )
        frame.place(relx=0.5, rely=0.5, anchor="center")

        self.make_label(
            frame, "Welcome Back",
            28, self.colors["gold"], True
        ).pack(pady=(35, 10))

        self.make_label(
            frame, "Unlock your SecureVault",
            13, self.colors["muted"]
        ).pack(pady=5)

        self.login_password = ctk.CTkEntry(
            frame,
            width=320,
            height=45,
            placeholder_text="Master Password",
            show="*"
        )
        self.login_password.pack(pady=20)

        self.make_button(
            frame, "Unlock Vault",
            self.login, 320
        ).pack(pady=12)

        ctk.CTkButton(
            frame,
            text="Back to Home",
            command=self.show_home_screen,
            fg_color="transparent",
            hover_color=self.colors["surface_light"],
            text_color=self.colors["muted"]
        ).pack(pady=(5, 25))

    def login(self):
        password = self.login_password.get()

        if not password:
            messagebox.showwarning(
                "Missing Password",
                "Please enter your master password."
            )
            return

        result = self.vault.unlock_vault(password)

        if result is not None:
            self.show_dashboard()
        else:
            messagebox.showerror(
                "Login Failed",
                "Incorrect master password."
            )
            self.login_password.delete(0, "end")

    # ---------------- DASHBOARD ----------------
    def generate_password_for_entry(self):
         password = generate_password(16)

         self.password_entry.delete(0, "end")
         self.password_entry.insert(0, password)

         messagebox.showinfo(
        "Password Generated",
        "A secure 16-character password has been generated."
         )
    def show_activity_history(self):
        history_window = ctk.CTkToplevel(self)
        history_window.title("SecureVault - Activity History")
        history_window.geometry("600x450")
        history_window.configure(
        fg_color=self.colors["background"]
    )

        title = ctk.CTkLabel(
        history_window,
        text="Activity History",
        font=("Arial", 24, "bold"),
        text_color=self.colors["gold"]
    )
        title.pack(pady=20)

        logs = self.vault.db.get_activity_logs()

        if not logs:
         ctk.CTkLabel(
            history_window,
            text="No activity recorded yet.",
            text_color=self.colors["muted"]
        ).pack(pady=20)
        return

        for action, timestamp in logs:
         ctk.CTkLabel(
            history_window,
            text=f"{action}  |  {timestamp}",
            text_color=self.colors["text"],
            font=("Arial", 13)
        ).pack(anchor="w", padx=25, pady=6)

    def show_dashboard(self):
        self.clear_screen()
        self.password_entry.pack(fill="x", padx=20, pady=7)
        self.strength_label = ctk.CTkLabel(
        add_frame,
        text="Password Strength: Not entered",
        text_color=self.colors["muted"],
        font=("Arial", 12)
         )
        self.strength_label.pack(anchor="w", padx=22, pady=3)
        header = ctk.CTkFrame(
            self,
            fg_color=self.colors["surface"],
            corner_radius=0,
            height=75
        )
        header.pack(fill="x")
        header.pack_propagate(False)

        self.make_label(
            header, "◆ SecureVault",
            22, self.colors["gold"], True
        ).pack(side="left", padx=25)

        self.make_button(
            header, "Lock Vault",
            self.lock_vault, 120
        ).pack(side="right", padx=25, pady=15)

        content = ctk.CTkScrollableFrame(
            self,
            fg_color=self.colors["background"]
        )
        content.pack(fill="both", expand=True, padx=25, pady=20)

        self.make_label(
            content, "Your Password Dashboard",
            26, self.colors["text"], True
        ).pack(anchor="w", pady=(10, 5))

        self.make_label(
            content, "Manage your saved credentials securely.",
            13, self.colors["muted"]
        ).pack(anchor="w", pady=(0, 20))

        # Add credential form
        add_frame = ctk.CTkFrame(
            content,
            fg_color=self.colors["surface"],
            corner_radius=15
        )
        add_frame.pack(fill="x", pady=10)

        self.make_label(
            add_frame, "Add New Credential",
            19, self.colors["gold"], True
        ).pack(anchor="w", padx=20, pady=(18, 10))

        self.website_entry = ctk.CTkEntry(
            add_frame,
            placeholder_text="Website (e.g. google.com)",
            height=40
        )
        self.website_entry.pack(fill="x", padx=20, pady=7)

        self.username_entry = ctk.CTkEntry(
            add_frame,
            placeholder_text="Username or Email",
            height=40
        )
        self.username_entry.pack(fill="x", padx=20, pady=7)
        self.make_button(
         add_frame,
         "Generate Password",
         self.generate_password_for_entry,
          200
         ).pack(anchor="w", padx=20, pady=5)

        self.password_entry = ctk.CTkEntry(
            add_frame,
            placeholder_text="Password",
            show="*",
            height=40
        )
        self.password_entry.pack(fill="x", padx=20, pady=7)

        self.password_entry.bind(
          "<KeyRelease>",
           lambda event: self.update_password_strength(
           self.password_entry.get()
          )
        )
        self.make_button(
            add_frame, "Save Credential",
            self.add_credential, 200
        ).pack(anchor="w", padx=20, pady=15)

        # Search
        search_frame = ctk.CTkFrame(
            content, fg_color=self.colors["surface"],
            corner_radius=15
        )
        search_frame.pack(fill="x", pady=10)

        self.make_label(
            search_frame, "Search Credentials",
            18, self.colors["gold"], True
        ).pack(anchor="w", padx=20, pady=(15, 8))

        self.search_entry = ctk.CTkEntry(
            search_frame,
            placeholder_text="Search by website",
            height=40
        )
        self.search_entry.pack(fill="x", padx=20, pady=7)

        buttons = ctk.CTkFrame(
            search_frame, fg_color="transparent"
        )
        buttons.pack(anchor="w", padx=20, pady=10)

        self.make_button(
            buttons, "Search",
            self.search_credentials, 110
        ).pack(side="left", padx=(0, 10))

        self.make_button(
        self,
        "Activity History",
        self.show_activity_history,
         200
        ).pack(pady=10)

        self.make_button(
            buttons, "Show All",
            self.load_credentials, 110
        ).pack(side="left")

        # Credential list
        self.list_frame = ctk.CTkFrame(
            content,
            fg_color=self.colors["surface"],
            corner_radius=15
        )
        self.list_frame.pack(fill="both", expand=True, pady=10)

        self.make_label(
            self.list_frame, "Saved Credentials",
            19, self.colors["gold"], True
        ).pack(anchor="w", padx=20, pady=15)

        self.credentials_frame = ctk.CTkFrame(
            self.list_frame,
            fg_color="transparent"
        )
        self.credentials_frame.pack(fill="both", expand=True, padx=15)

        self.load_credentials()

    # ---------------- CREDENTIAL OPERATIONS ----------------

    def add_credential(self):
        website = self.website_entry.get().strip()
        username = self.username_entry.get().strip()
        password = self.password_entry.get()

        if not website or not username or not password:
            messagebox.showwarning(
                "Missing Fields",
                "Please fill in all credential fields."
            )
            return

        result = self.vault.add_credential(
            website, username, password
        )

        if result:
            messagebox.showinfo(
                "Saved",
                "Credential saved successfully!"
            )

            self.website_entry.delete(0, "end")
            self.username_entry.delete(0, "end")
            self.password_entry.delete(0, "end")

            self.load_credentials()

    def clear_credential_list(self):
        for widget in self.credentials_frame.winfo_children():
            widget.destroy()

    def display_credentials(self, credentials):
        self.clear_credential_list()

        self.current_credentials = credentials

        if not credentials:
            self.make_label(
                self.credentials_frame,
                "No credentials found.",
                13, self.colors["muted"]
            ).pack(pady=20)
            return

        for credential in credentials:
            card = ctk.CTkFrame(
                self.credentials_frame,
                fg_color=self.colors["surface_light"],
                corner_radius=12
            )
            card.pack(fill="x", pady=7)

            self.make_label(
                card,
                credential["website"],
                16, self.colors["gold"], True
            ).pack(anchor="w", padx=15, pady=(12, 4))

            self.make_label(
                card,
                "Username: " + credential["username"],
                13, self.colors["text"]
            ).pack(anchor="w", padx=15, pady=3)

            # Password is hidden initially
            password_label = self.make_label(
                card,
                "Password: ••••••••••",
                13, self.colors["muted"]
            )
            password_label.pack(anchor="w", padx=15, pady=3)

            visible = {"value": False}

            def toggle_password(
                label=password_label,
                password=credential["password"],
                state=visible
            ):
                state["value"] = not state["value"]

                if state["value"]:
                    label.configure(text="Password: " + password)
                else:
                    label.configure(text="Password: ••••••••••")

            actions = ctk.CTkFrame(
                card, fg_color="transparent"
            )
            actions.pack(anchor="w", padx=10, pady=10)

            ctk.CTkButton(
                actions,
                text="Show / Hide",
                width=95,
                height=30,
                command=toggle_password,
                fg_color=self.colors["gold"],
                hover_color=self.colors["gold_hover"],
                text_color="#111111"
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                actions,
                text="Update",
                width=80,
                height=30,
                command=lambda c=credential: self.update_credential(c),
                fg_color=self.colors["surface"],
                hover_color=self.colors["border"]
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                actions,
                text="Delete",
                width=80,
                height=30,
                command=lambda c=credential: self.delete_credential(c["id"]),
                fg_color="#762E32",
                hover_color="#963A40"
            ).pack(side="left", padx=5)

    def load_credentials(self):
        credentials = self.vault.get_credentials()
        self.display_credentials(credentials)

    def search_credentials(self):
        website = self.search_entry.get().strip()

        if not website:
            self.load_credentials()
            return

        credentials = self.vault.search_credentials(website)
        self.display_credentials(credentials)

    def update_credential(self, credential):
        dialog = ctk.CTkInputDialog(
            text="Enter new website:",
            title="Update Credential"
        )
        website = dialog.get_input()

        if website is None or not website.strip():
            return

        username_dialog = ctk.CTkInputDialog(
            text="Enter new username:",
            title="Update Credential"
        )
        username = username_dialog.get_input()

        if username is None or not username.strip():
            return

        password_dialog = ctk.CTkInputDialog(
            text="Enter new password:",
            title="Update Credential"
        )
        password = password_dialog.get_input()

        if password is None or not password:
            return

        result = self.vault.update_credential(
            credential["id"],
            website.strip(),
            username.strip(),
            password
        )

        if result:
            messagebox.showinfo(
                "Updated",
                "Credential updated successfully!"
            )
            self.load_credentials()

    def delete_credential(self, credential_id):
        confirm = messagebox.askyesno(
            "Confirm Delete",
            "Are you sure you want to delete this credential?"
        )

        if confirm:
            result = self.vault.delete_credential(credential_id)

            if result:
                messagebox.showinfo(
                    "Deleted",
                    "Credential deleted successfully."
                )
                self.load_credentials()

    # ---------------- LOCK AND CLOSE ----------------

    def lock_vault(self):
        self.vault.lock_vault()
        self.show_login_screen()

    def on_close(self):
        self.vault.close()
        self.destroy()


if __name__ == "__main__":
    app = SecureVaultApp()
    app.mainloop()

export function Footer() {
  return (
    <footer className="flex items-center justify-center border-t px-6 py-4">
      <p className="text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} DreamLogApp. All rights reserved.
      </p>
    </footer>
  );
}

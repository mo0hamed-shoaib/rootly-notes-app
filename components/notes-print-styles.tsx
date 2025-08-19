"use client"

export function NotesPrintStyles() {
  const css = `@media print {
  .notes-page { background: #fff !important; color: #111 !important; }

  /* Remove global chrome in print when on Notes page */
  header, footer { display: none !important; }

  .notes-page .notes-controls,
  .notes-page .notes-export,
  .notes-page nav,
  .notes-page [role="navigation"],
  .notes-page button,
  .notes-page .note-actions,
  .notes-page .pagination,
  .notes-page .Pagination,
  .notes-page .ToastViewport,
  .notes-page .theme-toggle { display: none !important; }

  .notes-page .notes-grid { display: block !important; }
  .notes-page .notes-grid > * { break-inside: avoid; page-break-inside: avoid; margin-bottom: 16px; }

  .notes-page [data-print-card] { box-shadow: none !important; border: 1px solid #111111 !important; }

  /* Improve contrast for muted text and badges */
  .notes-page .text-muted-foreground { color: #111 !important; }
  .notes-page h3, .notes-page p { color: #111 !important; }
  .notes-page .badge,
  .notes-page .Badge,
  .notes-page [class*="badge"] { color: #111 !important; border-color: #111 !important; }
  .notes-page .text-orange-600 { color: #111 !important; }
  .notes-page .border-orange-600 { border-color: #111 !important; }

  /* Neutralize colored badge backgrounds for high-contrast printing */
  .notes-page .bg-red-500,
  .notes-page .bg-orange-500,
  .notes-page .bg-yellow-500,
  .notes-page .bg-blue-500,
  .notes-page .bg-green-500 { background: transparent !important; color: #111 !important; border: 1px solid #111 !important; }

  .notes-page h1 { font-size: 20pt !important; margin-bottom: 8pt !important; }
  .notes-page h3 { font-size: 13pt !important; }
  .notes-page p, .notes-page li { font-size: 11pt !important; line-height: 1.5 !important; }

  .notes-page mark { background: #fff59d !important; color: inherit !important; }

  @page { size: A4; margin: 16mm; }
}`

  return <style media="print" dangerouslySetInnerHTML={{ __html: css }} />
}



from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
import textwrap


ROOT = Path(__file__).resolve().parent
INPUT_PATH = ROOT / "RiderApp_Client_Flow_Guide.md"
OUTPUT_PATH = ROOT / "RiderApp_Client_Flow_Guide.pdf"

PAGE_WIDTH = 595.28
PAGE_HEIGHT = 841.89
MARGIN_LEFT = 54
MARGIN_RIGHT = 54
MARGIN_TOP = 64
MARGIN_BOTTOM = 52
CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT


@dataclass
class Line:
    text: str
    font: str
    size: float
    leading: float
    color: tuple[float, float, float]
    indent: float = 0
    gap_before: float = 0


def escape_pdf_text(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def normalize_text(value: str) -> str:
    replacements = {
        "\u2019": "'",
        "\u2018": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2013": "-",
        "\u2014": "-",
        "\u2026": "...",
        "\u00a0": " ",
    }
    for src, dest in replacements.items():
        value = value.replace(src, dest)
    return value


def approx_chars(width: float, font_size: float) -> int:
    return max(24, int(width / (font_size * 0.54)))


def wrap_text(text: str, width: float, font_size: float, initial_indent: str = "", subsequent_indent: str = "") -> list[str]:
    wrapped = textwrap.wrap(
        text,
        width=approx_chars(width, font_size),
        initial_indent=initial_indent,
        subsequent_indent=subsequent_indent,
        break_long_words=False,
        break_on_hyphens=False,
    )
    return wrapped or [""]


def parse_markdown(markdown: str) -> list[Line]:
    lines: list[Line] = []
    raw_lines = [normalize_text(line.rstrip()) for line in markdown.splitlines()]
    i = 0

    while i < len(raw_lines):
        raw = raw_lines[i].strip()

        if not raw:
            i += 1
            continue

        if raw.startswith("# "):
            lines.append(Line(raw[2:].strip(), "F2", 24, 30, (0.10, 0.17, 0.23), gap_before=0))
            i += 1
            continue

        if raw.startswith("## "):
            lines.append(Line(raw[3:].strip(), "F2", 15, 22, (0.45, 0.27, 0.06), gap_before=12))
            i += 1
            continue

        if raw.startswith("### "):
            lines.append(Line(raw[4:].strip(), "F2", 11.5, 17, (0.10, 0.17, 0.23), gap_before=8))
            i += 1
            continue

        if raw.startswith("- "):
            bullet_text = raw[2:].strip()
            wrapped = wrap_text(bullet_text, CONTENT_WIDTH - 18, 10.5)
            for index, item in enumerate(wrapped):
                text = f"- {item}" if index == 0 else f"  {item}"
                lines.append(Line(text, "F1", 10.5, 15, (0.18, 0.20, 0.24), indent=8))
            i += 1
            continue

        if re.match(r"^[A-Za-z].*:$", raw):
            lines.append(Line(raw, "F2", 10.5, 15, (0.18, 0.20, 0.24), gap_before=6))
            i += 1
            continue

        paragraph_parts = [raw]
        j = i + 1
        while j < len(raw_lines):
            next_line = raw_lines[j].strip()
            if not next_line:
                break
            if next_line.startswith(("# ", "## ", "### ", "- ")):
                break
            paragraph_parts.append(next_line)
            j += 1

        paragraph = " ".join(paragraph_parts)
        wrapped = wrap_text(paragraph, CONTENT_WIDTH, 10.5)
        for index, item in enumerate(wrapped):
            lines.append(Line(item, "F1", 10.5, 15, (0.18, 0.20, 0.24), gap_before=4 if index == 0 else 0))
        i = j + 1 if j < len(raw_lines) and raw_lines[j].strip() == "" else j

    return lines


class PdfBuilder:
    def __init__(self) -> None:
        self.pages: list[str] = []
        self.current_ops: list[str] = []
        self.cursor_y = PAGE_HEIGHT - MARGIN_TOP
        self.page_number = 0

    def start_page(self) -> None:
        if self.current_ops:
            self.finish_page()
        self.page_number += 1
        self.current_ops = []
        self.cursor_y = PAGE_HEIGHT - MARGIN_TOP
        self.draw_page_chrome()

    def finish_page(self) -> None:
        footer_y = MARGIN_BOTTOM - 18
        self.current_ops.append("BT")
        self.current_ops.append("/F1 9 Tf")
        self.current_ops.append("0.45 0.49 0.55 rg")
        self.current_ops.append(f"1 0 0 1 {PAGE_WIDTH - 82:.2f} {footer_y:.2f} Tm")
        self.current_ops.append(f"({escape_pdf_text(f'Page {self.page_number}')}) Tj")
        self.current_ops.append("ET")
        self.pages.append("\n".join(self.current_ops))
        self.current_ops = []

    def draw_page_chrome(self) -> None:
        self.current_ops.append("q")
        self.current_ops.append("0.89 0.94 0.90 rg")
        self.current_ops.append(f"0 {PAGE_HEIGHT - 18:.2f} {PAGE_WIDTH:.2f} 18 re f")
        self.current_ops.append("Q")

    def ensure_space(self, needed: float) -> None:
        if self.page_number == 0:
            self.start_page()
        if self.cursor_y - needed < MARGIN_BOTTOM:
            self.start_page()

    def add_line(self, line: Line) -> None:
        needed = line.gap_before + line.leading
        self.ensure_space(needed)
        self.cursor_y -= line.gap_before
        x = MARGIN_LEFT + line.indent
        r, g, b = line.color
        self.current_ops.append("BT")
        self.current_ops.append(f"/{line.font} {line.size:.2f} Tf")
        self.current_ops.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        self.current_ops.append(f"1 0 0 1 {x:.2f} {self.cursor_y:.2f} Tm")
        self.current_ops.append(f"({escape_pdf_text(line.text)}) Tj")
        self.current_ops.append("ET")
        self.cursor_y -= line.leading

    def build(self) -> bytes:
        if self.current_ops:
            self.finish_page()

        objects: list[bytes] = []

        def add_object(data: str | bytes) -> int:
            payload = data.encode("latin-1") if isinstance(data, str) else data
            objects.append(payload)
            return len(objects)

        font_regular_id = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
        font_bold_id = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
        pages_id = add_object("<< >>")

        page_ids: list[int] = []

        for page in self.pages:
            stream = page.encode("latin-1")
            content_id = add_object(
                b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream"
            )

            page_dict = (
                f"<< /Type /Page /Parent {pages_id} 0 R "
                f"/MediaBox [0 0 {PAGE_WIDTH:.2f} {PAGE_HEIGHT:.2f}] "
                f"/Resources << /Font << /F1 {font_regular_id} 0 R /F2 {font_bold_id} 0 R >> >> "
                f"/Contents {content_id} 0 R >>"
            )
            page_id = add_object(page_dict)
            page_ids.append(page_id)

        kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
        objects[pages_id - 1] = f"<< /Type /Pages /Count {len(page_ids)} /Kids [{kids}] >>".encode("latin-1")
        catalog_id = add_object(f"<< /Type /Catalog /Pages {pages_id} 0 R >>")

        pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0]

        for index, obj in enumerate(objects, start=1):
            offsets.append(len(pdf))
            pdf.extend(f"{index} 0 obj\n".encode("ascii"))
            pdf.extend(obj)
            pdf.extend(b"\nendobj\n")

        xref_offset = len(pdf)
        pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
        pdf.extend(b"0000000000 65535 f \n")
        for offset in offsets[1:]:
            pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
        pdf.extend(
            (
                f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\n"
                f"startxref\n{xref_offset}\n%%EOF\n"
            ).encode("ascii")
        )
        return bytes(pdf)


def main() -> None:
    markdown = INPUT_PATH.read_text(encoding="utf-8")
    lines = parse_markdown(markdown)
    builder = PdfBuilder()
    for line in lines:
        builder.add_line(line)
    OUTPUT_PATH.write_bytes(builder.build())
    print(f"Created {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

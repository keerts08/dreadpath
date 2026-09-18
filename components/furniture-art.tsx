interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function drawHotspotIcon(
  ctx: CanvasRenderingContext2D,
  id: string,
  zone: Rect,
  accent: string,
  resolved: boolean,
  flags: Record<string, boolean>,
) {
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h / 2;
  const s = Math.min(zone.w, zone.h);

  ctx.save();
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (resolved) ctx.globalAlpha = 0.5;

  switch (id) {
    case "chandelier": {
      line(ctx, cx, zone.y, cx, cy - s * 0.22);
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.1, s * 0.14, 0, Math.PI * 2);
      ctx.stroke();
      for (const a of [-1, -0.5, 0, 0.5, 1]) {
        const ex = cx + a * s * 0.32;
        const ey = cy + s * 0.16;
        line(ctx, cx, cy - s * 0.02, ex, ey);
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.ellipse(ex, ey - 3, 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      break;
    }
    case "doorMechanism": {
      ctx.strokeRect(cx - s * 0.28, cy - s * 0.32, s * 0.56, s * 0.64);
      for (const dx of [-0.15, 0, 0.15]) {
        ctx.beginPath();
        ctx.arc(cx + dx * s, cy - s * 0.1, s * 0.06, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.7;
      ctx.strokeRect(cx - s * 0.15, cy + s * 0.12, s * 0.3, s * 0.14);
      ctx.globalAlpha = 1;
      break;
    }
    case "placeWards": {
      for (const dx of [-0.32, 0, 0.32]) {
        ctx.beginPath();
        ctx.arc(cx + dx * s, cy, s * 0.16, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case "speakName": {
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.22, 0, Math.PI * 2);
      ctx.stroke();
      line(ctx, cx, cy - s * 0.22, cx, cy + s * 0.22);
      line(ctx, cx - s * 0.16, cy - s * 0.12, cx + s * 0.16, cy - s * 0.12);
      break;
    }
    case "desk": {
      ctx.strokeRect(zone.x + 6, cy - s * 0.1, zone.w - 12, s * 0.22);
      line(ctx, zone.x + 12, cy + s * 0.12, zone.x + 12, zone.y + zone.h - 6);
      line(
        ctx,
        zone.x + zone.w - 12,
        cy + s * 0.12,
        zone.x + zone.w - 12,
        zone.y + zone.h - 6,
      );
      ctx.beginPath();
      ctx.arc(zone.x + zone.w - 26, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "drawer": {
      const open = flags.drawerOpen;
      ctx.strokeRect(zone.x + 6, zone.y + 4, zone.w - 12, zone.h - 8);
      if (open) {
        ctx.globalAlpha = 0.5;
        ctx.fillRect(zone.x + 10, zone.y + 8, zone.w - 20, zone.h - 16);
        ctx.globalAlpha = 1;
      } else {
        line(
          ctx,
          zone.x + 10,
          zone.y + 6,
          zone.x + zone.w - 10,
          zone.y + zone.h - 6,
        );
        line(
          ctx,
          zone.x + zone.w - 14,
          zone.y + 6,
          zone.x + 14,
          zone.y + zone.h - 6,
        );
      }
      line(ctx, cx - 12, cy, cx + 12, cy);
      break;
    }
    case "drawerKey": {
      ctx.beginPath();
      ctx.arc(cx - 6, cy, 5, 0, Math.PI * 2);
      ctx.stroke();
      line(ctx, cx - 1, cy, cx + 12, cy);
      line(ctx, cx + 8, cy, cx + 8, cy + 4);
      line(ctx, cx + 12, cy, cx + 12, cy + 4);
      break;
    }
    case "drawerPage": {
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 10);
      ctx.lineTo(cx + 6, cy - 10);
      ctx.lineTo(cx + 10, cy - 6);
      ctx.lineTo(cx + 10, cy + 10);
      ctx.lineTo(cx - 8, cy + 10);
      ctx.closePath();
      ctx.stroke();
      line(ctx, cx + 6, cy - 10, cx + 6, cy - 6);
      line(ctx, cx + 10, cy - 6, cx + 6, cy - 6);
      for (const dy of [-2, 2, 6]) line(ctx, cx - 4, cy + dy, cx + 5, cy + dy);
      break;
    }
    case "portrait": {
      ctx.strokeRect(zone.x + 5, zone.y + 5, zone.w - 10, zone.h - 10);
      ctx.strokeRect(zone.x + 10, zone.y + 10, zone.w - 20, zone.h - 20);
      ctx.beginPath();
      ctx.ellipse(cx, cy - 4, zone.w * 0.16, zone.h * 0.14, 0, 0, Math.PI * 2);
      ctx.stroke();
      line(
        ctx,
        cx - zone.w * 0.14,
        cy + zone.h * 0.22,
        cx + zone.w * 0.14,
        cy + zone.h * 0.22,
      );
      break;
    }
    case "loreBooks":
    case "bookshelf": {
      const open = id === "bookshelf" && flags.bookshelfOpen;
      for (let row = 0; row < 2; row++) {
        const sy = zone.y + 10 + row * (zone.h / 2 - 6);
        line(
          ctx,
          zone.x + 6,
          sy + zone.h / 4 - 10,
          zone.x + zone.w - 6,
          sy + zone.h / 4 - 10,
        );
      }
      let bx = zone.x + 10;
      const heights = [0.7, 0.9, 0.55, 0.8, 0.65, 0.85];
      let hi = 0;
      while (bx < zone.x + zone.w - 12) {
        const bh = (zone.h / 2 - 14) * heights[hi % heights.length];
        ctx.globalAlpha = 0.75;
        ctx.fillRect(bx, zone.y + zone.h / 4 - 10 - bh, 6, bh);
        ctx.globalAlpha = 1;
        bx += 9;
        hi++;
      }
      if (id === "bookshelf" && open) {
        ctx.globalAlpha = 0.5;
        ctx.fillRect(
          zone.x + zone.w * 0.3,
          zone.y + zone.h * 0.55,
          zone.w * 0.4,
          zone.h * 0.35,
        );
        ctx.globalAlpha = 1;
        ctx.strokeRect(
          zone.x + zone.w * 0.3,
          zone.y + zone.h * 0.55,
          zone.w * 0.4,
          zone.h * 0.35,
        );
      } else if (id === "bookshelf") {
        line(
          ctx,
          zone.x + zone.w - 8,
          zone.y + 4,
          zone.x + zone.w - 8,
          zone.y + zone.h - 4,
        );
      }
      break;
    }
    case "sigilMoonSpot": {
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.24, 0, Math.PI * 2);
      ctx.globalAlpha = flags.bookshelfOpen ? 0.9 : 0.35;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 3, cy, s * 0.16, 0.6 * Math.PI, 1.6 * Math.PI);
      ctx.stroke();
      ctx.globalAlpha = 1;
      break;
    }
    case "table": {
      ctx.strokeRect(zone.x + 6, cy - s * 0.14, zone.w - 12, s * 0.28);
      let px = zone.x + zone.w * 0.15;
      while (px < zone.x + zone.w * 0.85) {
        ctx.beginPath();
        ctx.ellipse(px, cy, 5, 3.2, 0, 0, Math.PI * 2);
        ctx.stroke();
        px += zone.w * 0.16;
      }
      break;
    }
    case "pushedChair": {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.25);
      ctx.strokeRect(-12, -8, 24, 20);
      line(ctx, -12, -8, -12, -22);
      line(ctx, 12, -8, 12, -22);
      line(ctx, -12, -22, 12, -22);
      ctx.restore();
      break;
    }
    case "counter": {
      ctx.strokeRect(zone.x + 6, zone.y + zone.h - 18, zone.w - 12, 14);
      for (const dx of [-0.2, 0.2]) {
        ctx.beginPath();
        ctx.arc(cx + dx * zone.w, cy - 4, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case "knifeBlock": {
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy + 12);
      ctx.lineTo(cx + 14, cy + 12);
      ctx.lineTo(cx + 10, cy - 6);
      ctx.lineTo(cx - 10, cy - 6);
      ctx.closePath();
      ctx.stroke();
      for (const dx of [-6, 0, 6])
        line(ctx, cx + dx, cy - 6, cx + dx * 1.4, cy - 22);
      break;
    }
    case "pantry": {
      ctx.globalAlpha = 0.5;
      ctx.fillRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      ctx.globalAlpha = 1;
      ctx.strokeRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      for (let sy = zone.y + 16; sy < zone.y + zone.h - 10; sy += 10) {
        line(ctx, zone.x + 12, sy, zone.x + zone.w - 12, sy);
      }
      break;
    }
    case "wallpaper": {
      ctx.beginPath();
      ctx.moveTo(zone.x + 4, zone.y + 4);
      ctx.lineTo(zone.x + zone.w * 0.4, zone.y + zone.h * 0.3);
      ctx.lineTo(zone.x + zone.w * 0.2, zone.y + zone.h * 0.6);
      ctx.lineTo(zone.x + zone.w * 0.55, zone.y + zone.h - 6);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.7;
      for (let g = 0; g < 2; g++) {
        const gx = zone.x + zone.w * 0.65 + g * 16;
        for (let i = 0; i < 4; i++)
          line(ctx, gx + i * 3, zone.y + 8, gx + i * 3, zone.y + zone.h - 8);
        line(ctx, gx - 2, cy, gx + 12, cy);
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "mirror": {
      ctx.beginPath();
      ctx.ellipse(cx, cy, zone.w * 0.28, zone.h * 0.36, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      line(
        ctx,
        cx - zone.w * 0.12,
        cy - zone.h * 0.2,
        cx + zone.w * 0.06,
        cy + zone.h * 0.2,
      );
      ctx.globalAlpha = 1;
      break;
    }
    case "tub": {
      ctx.beginPath();
      ctx.moveTo(zone.x + 10, zone.y + 10);
      ctx.arcTo(
        zone.x + zone.w - 8,
        zone.y + 10,
        zone.x + zone.w - 8,
        zone.y + zone.h - 10,
        16,
      );
      ctx.arcTo(
        zone.x + zone.w - 8,
        zone.y + zone.h - 10,
        zone.x + 10,
        zone.y + zone.h - 10,
        16,
      );
      ctx.lineTo(zone.x + 10, zone.y + zone.h - 10);
      ctx.closePath();
      ctx.stroke();
      for (const dx of [0.12, 0.88]) {
        ctx.beginPath();
        ctx.ellipse(
          zone.x + zone.w * dx,
          zone.y + zone.h - 4,
          3,
          5,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
      break;
    }
    case "mattress": {
      ctx.strokeRect(zone.x + 6, cy - s * 0.18, zone.w - 12, s * 0.4);
      ctx.beginPath();
      ctx.ellipse(zone.x + 22, cy - s * 0.18, 12, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "nightstand": {
      ctx.strokeRect(cx - s * 0.2, cy - s * 0.22, s * 0.4, s * 0.44);
      line(ctx, cx - s * 0.06, cy, cx + s * 0.06, cy);
      break;
    }
    case "wardrobe": {
      ctx.globalAlpha = 0.4;
      ctx.fillRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      ctx.globalAlpha = 1;
      ctx.strokeRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      line(ctx, cx, zone.y + 6, cx, zone.y + zone.h - 6);
      ctx.beginPath();
      ctx.arc(cx - 6, cy, 2, 0, Math.PI * 2);
      ctx.arc(cx + 6, cy, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "workbench": {
      ctx.strokeRect(zone.x + 6, zone.y + zone.h - 16, zone.w - 12, 10);
      line(ctx, zone.x + 12, cy - 10, zone.x + 12, zone.y + zone.h - 6);
      line(
        ctx,
        zone.x + zone.w - 12,
        cy - 10,
        zone.x + zone.w - 12,
        zone.y + zone.h - 6,
      );
      line(ctx, cx - 14, cy - 8, cx + 2, cy - 20);
      line(ctx, cx + 6, cy - 6, cx + 18, cy - 18);
      break;
    }
    case "fuseBox": {
      ctx.strokeRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      for (const dx of [-0.18, 0, 0.18]) {
        const filled = dx !== 0;
        ctx.globalAlpha = filled ? 0.9 : 0.3;
        line(ctx, cx + dx * zone.w, cy - 8, cx + dx * zone.w, cy + 8);
        ctx.globalAlpha = 1;
      }
      break;
    }
    case "wineRack": {
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          const bx = zone.x + 14 + (c * (zone.w - 28)) / 2;
          const by = zone.y + 12 + r * (zone.h - 24);
          ctx.beginPath();
          ctx.ellipse(bx, by, 8, 4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      break;
    }
    case "cellarNote": {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0.08);
      ctx.strokeRect(-14, -10, 28, 20);
      line(ctx, -14, -3, 12, -3);
      line(ctx, -14, 3, 8, 3);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx - 12, cy - 8, 1.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "trunk": {
      const open = flags.trunkOpen;
      ctx.strokeRect(
        zone.x + 8,
        zone.y + zone.h * 0.35,
        zone.w - 16,
        zone.h * 0.5,
      );
      if (open) {
        ctx.beginPath();
        ctx.moveTo(zone.x + 8, zone.y + zone.h * 0.35);
        ctx.lineTo(zone.x + zone.w * 0.3, zone.y + 6);
        ctx.lineTo(zone.x + zone.w - 8, zone.y + zone.h * 0.35);
        ctx.stroke();
      } else {
        ctx.strokeRect(
          zone.x + 8,
          zone.y + zone.h * 0.22,
          zone.w - 16,
          zone.h * 0.16,
        );
        line(
          ctx,
          zone.x + 12,
          zone.y + zone.h * 0.35,
          zone.x + zone.w - 12,
          zone.y + zone.h * 0.75,
        );
        line(
          ctx,
          zone.x + zone.w - 12,
          zone.y + zone.h * 0.35,
          zone.x + 12,
          zone.y + zone.h * 0.75,
        );
      }
      break;
    }
    case "trunkSigil": {
      ctx.globalAlpha = flags.trunkOpen ? 0.9 : 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        line(
          ctx,
          cx + Math.cos(a) * s * 0.24,
          cy + Math.sin(a) * s * 0.24,
          cx + Math.cos(a) * s * 0.32,
          cy + Math.sin(a) * s * 0.32,
        );
      }
      ctx.globalAlpha = 1;
      break;
    }
    default: {
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

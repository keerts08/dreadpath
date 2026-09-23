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

function drawTinyGlyph(
  ctx: CanvasRenderingContext2D,
  type: "moon" | "sun" | "vine",
  x: number,
  y: number,
  r: number,
) {
  ctx.save();
  ctx.lineWidth = Math.max(0.7, r * 0.22);
  if (type === "moon") {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(x + r * 0.4, y, r * 0.85, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === "sun") {
    ctx.beginPath();
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      line(
        ctx,
        x + Math.cos(a) * r * 0.68,
        y + Math.sin(a) * r * 0.68,
        x + Math.cos(a) * r * 1.05,
        y + Math.sin(a) * r * 1.05,
      );
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x - r * 0.95, y - r * 0.25, x, y);
    ctx.quadraticCurveTo(x + r * 0.95, y + r * 0.25, x, y + r);
    ctx.stroke();
  }
  ctx.restore();
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
      const topY = cy - s * 0.4;
      const ringY = topY + s * 0.22;
      const urnTop = topY + s * 0.05;

      ctx.beginPath();
      ctx.ellipse(cx, zone.y + 3, s * 0.05, s * 0.015, 0, 0, Math.PI * 2);
      ctx.stroke();

      const linkCount = 4;
      for (let i = 0; i < linkCount; i++) {
        const ly =
          zone.y + 4 + ((urnTop - (zone.y + 4)) * (i + 0.5)) / linkCount;
        ctx.beginPath();
        ctx.ellipse(cx, ly, s * 0.014, s * 0.03, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(cx - s * 0.05, urnTop);
      ctx.quadraticCurveTo(
        cx - s * 0.1,
        (urnTop + ringY) / 2,
        cx - s * 0.07,
        ringY,
      );
      ctx.lineTo(cx + s * 0.07, ringY);
      ctx.quadraticCurveTo(
        cx + s * 0.1,
        (urnTop + ringY) / 2,
        cx + s * 0.05,
        urnTop,
      );
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 0.55;
      for (const fx of [-0.035, 0, 0.035]) {
        line(ctx, cx + fx * s, urnTop + 1, cx + fx * s * 1.3, ringY - 1);
      }
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.ellipse(cx, ringY, s * 0.24, s * 0.06, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.ellipse(
        cx,
        ringY - s * 0.012,
        s * 0.19,
        s * 0.045,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;

      const arms = [-1, -0.55, 0, 0.55, 1];
      for (const a of arms) {
        const armX = cx + a * s * 0.22;
        const tipX = cx + a * s * 0.44;
        const tipY = ringY + s * 0.24;
        const midX = cx + a * s * 0.38;
        const midY = ringY + s * 0.08;

        ctx.beginPath();
        ctx.moveTo(armX, ringY);
        ctx.quadraticCurveTo(midX, midY, tipX, tipY);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(tipX, tipY - 2, 4, 1.6, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(tipX - 3, tipY - 1);
        ctx.lineTo(tipX + 3, tipY - 1);
        ctx.lineTo(tipX + 2, tipY + 4);
        ctx.lineTo(tipX - 2, tipY + 4);
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 0.5;
        line(ctx, tipX - 1, tipY - 1, tipX - 0.7, tipY + 4);
        line(ctx, tipX + 1, tipY - 1, tipX + 0.7, tipY + 4);
        ctx.globalAlpha = 1;

        line(ctx, tipX, tipY - 1, tipX, tipY - 9);
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(tipX - 1, tipY - 4);
        ctx.quadraticCurveTo(tipX - 1.6, tipY - 2, tipX - 0.8, tipY);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(tipX, tipY - 10, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 0.6;
      for (let i = 0; i < arms.length - 1; i++) {
        const a = (arms[i] + arms[i + 1]) / 2;
        const dropX = cx + a * s * 0.23;
        const dropY = ringY + s * 0.05;
        ctx.beginPath();
        ctx.moveTo(dropX, dropY);
        ctx.lineTo(dropX - 1.4, dropY + 4);
        ctx.lineTo(dropX, dropY + 7);
        ctx.lineTo(dropX + 1.4, dropY + 4);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "doorMechanism": {
      const px = cx - s * 0.28;
      const py = cy - s * 0.32;
      const pw = s * 0.56;
      const ph = s * 0.64;
      ctx.strokeRect(px, py, pw, ph);

      ctx.globalAlpha = 0.7;
      for (const [sx, sy] of [
        [px + 3, py + 3],
        [px + pw - 3, py + 3],
        [px + 3, py + ph - 3],
        [px + pw - 3, py + ph - 3],
      ]) {
        ctx.beginPath();
        ctx.arc(sx, sy, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const glyphs: Array<"moon" | "sun" | "vine"> = ["moon", "sun", "vine"];
      for (let i = 0; i < 3; i++) {
        const dx = [-0.15, 0, 0.15][i];
        const sockX = cx + dx * s;
        const sockY = cy - s * 0.1;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(sockX, sockY, s * 0.075, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(sockX, sockY, s * 0.06, 0, Math.PI * 2);
        ctx.stroke();
        drawTinyGlyph(ctx, glyphs[i], sockX, sockY, s * 0.032);
      }

      const kx = cx - s * 0.15;
      const ky = cy + s * 0.12;
      const kw = s * 0.3;
      const kh = s * 0.14;
      ctx.globalAlpha = 0.7;
      ctx.strokeRect(kx, ky, kw, kh);
      line(ctx, kx + 3, ky + kh * 0.4, kx + kw - 3, ky + kh * 0.4);
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          ctx.beginPath();
          ctx.arc(
            kx + kw * (0.2 + c * 0.3),
            ky + kh * (0.65 + r * 0),
            0.6,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "placeWards": {
      const glyphs: Array<"moon" | "sun" | "vine"> = ["moon", "sun", "vine"];
      for (let i = 0; i < 3; i++) {
        const dx = [-0.32, 0, 0.32][i];
        const x = cx + dx * s;
        ctx.beginPath();
        ctx.arc(x, cy, s * 0.16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, cy, s * 0.19, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        drawTinyGlyph(ctx, glyphs[i], x, cy, s * 0.08);
      }
      break;
    }
    case "speakName": {
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.27, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy + s * 0.02, s * 0.06, s * 0.03, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(
          cx,
          cy,
          s * 0.32,
          side > 0 ? -0.22 * Math.PI : 1.22 * Math.PI,
          side > 0 ? 0.22 * Math.PI : 0.78 * Math.PI,
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 0.4;
      line(ctx, cx - s * 0.16, cy - s * 0.15, cx - s * 0.22, cy - s * 0.26);
      line(ctx, cx + s * 0.18, cy + s * 0.14, cx + s * 0.25, cy + s * 0.24);
      ctx.globalAlpha = 1;
      break;
    }
    case "desk": {
      const topY = cy - s * 0.1;
      const topH = s * 0.22;
      ctx.strokeRect(zone.x + 6, topY, zone.w - 12, topH);
      ctx.globalAlpha = 0.35;
      for (const gy of [0.3, 0.6]) {
        line(
          ctx,
          zone.x + 10,
          topY + topH * gy,
          zone.x + zone.w - 10,
          topY + topH * gy,
        );
      }
      ctx.globalAlpha = 1;
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
      ctx.beginPath();
      ctx.arc(zone.x + 22, topY + topH * 0.5, 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(zone.x + 24, topY + topH * 0.4);
      ctx.quadraticCurveTo(zone.x + 34, topY - 4, zone.x + 40, topY - 10);
      ctx.stroke();
      break;
    }
    case "drawer": {
      const open = flags.drawerOpen;
      ctx.strokeRect(zone.x + 6, zone.y + 4, zone.w - 12, zone.h - 8);
      ctx.globalAlpha = 0.3;
      line(
        ctx,
        zone.x + 9,
        zone.y + zone.h / 2,
        zone.x + zone.w - 9,
        zone.y + zone.h / 2,
      );
      ctx.globalAlpha = 1;
      if (open) {
        ctx.globalAlpha = 0.5;
        ctx.fillRect(zone.x + 10, zone.y + 8, zone.w - 20, zone.h - 16);
        ctx.globalAlpha = 1;
        ctx.globalAlpha = 0.6;
        ctx.strokeRect(
          zone.x + zone.w * 0.4,
          zone.y + zone.h * 0.32,
          zone.w * 0.2,
          zone.h * 0.36,
        );
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
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy);
      ctx.lineTo(cx - 12, cy - 3);
      ctx.lineTo(cx + 12, cy - 3);
      ctx.lineTo(cx + 12, cy);
      ctx.stroke();
      break;
    }
    case "drawerKey": {
      ctx.beginPath();
      ctx.arc(cx - 6, cy, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(cx - 6, cy, 2.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      line(ctx, cx - 1, cy, cx + 13, cy);
      line(ctx, cx + 8, cy, cx + 8, cy + 4);
      line(ctx, cx + 12, cy, cx + 12, cy + 5);
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(cx - 6, cy, 6.4, -0.5, 0.9);
      ctx.stroke();
      ctx.globalAlpha = 1;
      break;
    }
    case "drawerPage": {
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 10);
      ctx.lineTo(cx - 3, cy - 8);
      ctx.lineTo(cx, cy - 11);
      ctx.lineTo(cx + 3, cy - 9);
      ctx.lineTo(cx + 6, cy - 10);
      ctx.lineTo(cx + 10, cy - 6);
      ctx.lineTo(cx + 10, cy + 10);
      ctx.lineTo(cx - 8, cy + 10);
      ctx.closePath();
      ctx.stroke();
      line(ctx, cx + 6, cy - 10, cx + 6, cy - 6);
      line(ctx, cx + 10, cy - 6, cx + 6, cy - 6);
      for (const dy of [-2, 2, 6]) line(ctx, cx - 4, cy + dy, cx + 5, cy + dy);
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(cx - 3, cy + 6, 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case "portrait": {
      ctx.strokeRect(zone.x + 5, zone.y + 5, zone.w - 10, zone.h - 10);
      ctx.strokeRect(zone.x + 10, zone.y + 10, zone.w - 20, zone.h - 20);
      ctx.globalAlpha = 0.6;
      for (const [fx, fy, sx, sy] of [
        [zone.x + 5, zone.y + 5, 1, 1],
        [zone.x + zone.w - 5, zone.y + 5, -1, 1],
        [zone.x + 5, zone.y + zone.h - 5, 1, -1],
        [zone.x + zone.w - 5, zone.y + zone.h - 5, -1, -1],
      ]) {
        line(ctx, fx, fy, fx + sx * 6, fy);
        line(ctx, fx, fy, fx, fy + sy * 6);
      }
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy - 4, zone.w * 0.16, zone.h * 0.14, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      line(
        ctx,
        cx - zone.w * 0.08,
        cy - zone.h * 0.08,
        cx - zone.w * 0.03,
        cy - zone.h * 0.08,
      );
      line(
        ctx,
        cx + zone.w * 0.03,
        cy - zone.h * 0.08,
        cx + zone.w * 0.08,
        cy - zone.h * 0.08,
      );
      ctx.globalAlpha = 1;
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
        ctx.globalAlpha = 0.5;
        line(
          ctx,
          zone.x + 6,
          sy + zone.h / 4 - 10,
          zone.x + 6,
          sy + zone.h / 4 - 4,
        );
        ctx.globalAlpha = 1;
      }
      let bx = zone.x + 10;
      const heights = [0.7, 0.9, 0.55, 0.8, 0.65, 0.85];
      let hi = 0;
      while (bx < zone.x + zone.w - 12) {
        const bh = (zone.h / 2 - 14) * heights[hi % heights.length];
        ctx.globalAlpha = 0.75;
        ctx.fillRect(bx, zone.y + zone.h / 4 - 10 - bh, 6, bh);
        ctx.globalAlpha = 0.9;
        ctx.fillRect(bx + 1, zone.y + zone.h / 4 - 10 - bh + 2, 4, 1.2);
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
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#000";
        ctx.fillRect(
          zone.x + zone.w * 0.33,
          zone.y + zone.h * 0.6,
          zone.w * 0.34,
          zone.h * 0.26,
        );
        ctx.fillStyle = accent;
        ctx.globalAlpha = 1;
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
      ctx.globalAlpha = 0.3;
      for (const a of [0.15, 0.85, 1.4]) {
        const ang = a * Math.PI;
        line(
          ctx,
          cx + Math.cos(ang) * s * 0.24,
          cy + Math.sin(ang) * s * 0.24,
          cx + Math.cos(ang) * s * 0.34,
          cy + Math.sin(ang) * s * 0.34,
        );
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "table": {
      const topY = cy - s * 0.14;
      const topH = s * 0.28;
      ctx.strokeRect(zone.x + 6, topY, zone.w - 12, topH);
      ctx.globalAlpha = 0.3;
      for (let fx = zone.x + 14; fx < zone.x + zone.w - 10; fx += 20) {
        line(ctx, fx, topY + topH, fx + 4, topY + topH + 5);
      }
      ctx.globalAlpha = 1;
      let px = zone.x + zone.w * 0.15;
      while (px < zone.x + zone.w * 0.85) {
        ctx.beginPath();
        ctx.ellipse(px, cy, 5, 3.2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.6;
        line(ctx, px - 8, cy - 3, px - 8, cy + 3);
        line(ctx, px + 8, cy - 3, px + 8, cy + 3);
        ctx.globalAlpha = 1;
        px += zone.w * 0.16;
      }
      break;
    }
    case "pushedChair": {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.25);
      ctx.strokeRect(-12, -8, 24, 20);
      ctx.globalAlpha = 0.35;
      for (const wx of [-6, 0, 6]) line(ctx, wx, -6, wx, 10);
      ctx.globalAlpha = 1;
      line(ctx, -12, -8, -12, -22);
      line(ctx, 12, -8, 12, -22);
      line(ctx, -12, -22, 12, -22);
      for (const sx of [-4, 4]) line(ctx, sx, -22, sx, -8);
      ctx.restore();
      break;
    }
    case "counter": {
      const topY = zone.y + zone.h - 18;
      ctx.strokeRect(zone.x + 6, topY, zone.w - 12, 14);
      ctx.globalAlpha = 0.35;
      for (let tx = zone.x + 10; tx < zone.x + zone.w - 8; tx += 8) {
        line(ctx, tx, topY + 2, tx, topY + 12);
      }
      ctx.globalAlpha = 1;
      for (const dx of [-0.2, 0.2]) {
        const bx = cx + dx * zone.w;
        ctx.beginPath();
        ctx.arc(bx, cy - 4, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bx, cy - 10);
        ctx.lineTo(bx, cy - 14);
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
      ctx.globalAlpha = 0.3;
      line(ctx, cx - 8, cy + 2, cx + 8, cy + 2);
      ctx.globalAlpha = 1;
      const widths = [1, 1.5, 0.8];
      let i = 0;
      for (const dx of [-6, 0, 6]) {
        line(ctx, cx + dx, cy - 6, cx + dx * 1.4, cy - 22 * widths[i]);
        i++;
      }
      break;
    }
    case "pantry": {
      ctx.globalAlpha = 0.5;
      ctx.fillRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      ctx.globalAlpha = 1;
      ctx.strokeRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      let shelfIndex = 0;
      for (let sy = zone.y + 16; sy < zone.y + zone.h - 10; sy += 10) {
        line(ctx, zone.x + 12, sy, zone.x + zone.w - 12, sy);
        ctx.globalAlpha = 0.7;
        for (let jx = zone.x + 16; jx < zone.x + zone.w - 14; jx += 9) {
          if (shelfIndex % 2 === 0) {
            ctx.strokeRect(jx, sy - 7, 5, 7);
          } else {
            ctx.beginPath();
            ctx.ellipse(jx + 2, sy - 4, 3, 4, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        shelfIndex++;
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
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(zone.x + zone.w * 0.4, zone.y + zone.h * 0.3);
      ctx.quadraticCurveTo(
        zone.x + zone.w * 0.5,
        zone.y + zone.h * 0.28,
        zone.x + zone.w * 0.48,
        zone.y + zone.h * 0.2,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
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
      const r = s * 0.3;

      ctx.beginPath();
      ctx.arc(cx, cy - r - 3, 2, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - r - 1, 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.globalAlpha = 0.7;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(a) * r * 0.93,
          cy + Math.sin(a) * r * 0.93,
          0.8,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.globalAlpha = 0.45;
      line(ctx, cx - r * 0.42, cy - r * 0.4, cx + r * 0.1, cy + r * 0.42);
      ctx.globalAlpha = 0.25;
      line(ctx, cx - r * 0.05, cy - r * 0.5, cx + r * 0.32, cy - r * 0.05);
      ctx.globalAlpha = 1;

      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.35, cy + r * 0.5);
      ctx.lineTo(cx + r * 0.5, cy + r * 0.3);
      ctx.lineTo(cx + r * 0.42, cy + r * 0.22);
      ctx.lineTo(cx + r * 0.55, cy + r * 0.05);
      ctx.stroke();
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
      ctx.globalAlpha = 0.3;
      line(ctx, zone.x + 14, zone.y + 16, zone.x + zone.w - 12, zone.y + 16);
      ctx.globalAlpha = 1;
      for (const dx of [0.12, 0.88]) {
        const fx = zone.x + zone.w * dx;
        const fy = zone.y + zone.h - 4;
        ctx.beginPath();
        ctx.ellipse(fx, fy, 3, 5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.6;
        line(ctx, fx - 1.5, fy + 4, fx - 3, fy + 7);
        line(ctx, fx + 1.5, fy + 4, fx + 3, fy + 7);
        ctx.globalAlpha = 1;
      }
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(cx, zone.y + zone.h * 0.55);
      ctx.quadraticCurveTo(
        cx - 3,
        zone.y + zone.h * 0.65,
        cx - 1,
        zone.y + zone.h * 0.75,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
      break;
    }
    case "mattress": {
      const mx = zone.x + 6;
      const my = cy - s * 0.18;
      const mw = zone.w - 12;
      const mh = s * 0.4;
      ctx.strokeRect(mx, my, mw, mh);
      ctx.globalAlpha = 0.4;
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          ctx.beginPath();
          ctx.arc(
            mx + mw * (0.15 + c * 0.23),
            my + mh * (0.3 + r * 0.4),
            0.8,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.ellipse(zone.x + 22, cy - s * 0.18, 12, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.ellipse(zone.x + 22, cy - s * 0.18, 8, 4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      break;
    }
    case "nightstand": {
      const nx = cx - s * 0.2;
      const ny = cy - s * 0.22;
      const nw = s * 0.4;
      const nh = s * 0.44;
      ctx.strokeRect(nx, ny, nw, nh);
      line(ctx, cx - s * 0.06, cy, cx + s * 0.06, cy);
      ctx.globalAlpha = 0.3;
      line(ctx, nx + 2, ny + nh * 0.3, nx + nw - 2, ny + nh * 0.3);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(cx + nw * 0.28, ny - 3, 2.4, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "wardrobe": {
      ctx.globalAlpha = 0.4;
      ctx.fillRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      ctx.globalAlpha = 1;
      ctx.strokeRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      line(ctx, cx, zone.y + 6, cx, zone.y + zone.h - 6);
      ctx.globalAlpha = 0.4;
      ctx.strokeRect(zone.x + 13, zone.y + 12, zone.w / 2 - 18, zone.h * 0.3);
      ctx.strokeRect(cx + 5, zone.y + 12, zone.w / 2 - 18, zone.h * 0.3);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 3);
      ctx.lineTo(cx - 6, cy + 3);
      ctx.moveTo(cx + 6, cy - 3);
      ctx.lineTo(cx + 6, cy + 3);
      ctx.stroke();
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
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(zone.x + 16, zone.y + 6);
      ctx.lineTo(zone.x + 16, zone.y + 18);
      ctx.stroke();
      ctx.strokeRect(zone.x + 12, zone.y + 3, 8, 5);
      ctx.globalAlpha = 1;
      ctx.strokeRect(zone.x + zone.w - 24, zone.y + zone.h - 20, 10, 6);
      line(
        ctx,
        zone.x + zone.w - 21,
        zone.y + zone.h - 20,
        zone.x + zone.w - 21,
        zone.y + zone.h - 26,
      );
      break;
    }
    case "fuseBox": {
      ctx.strokeRect(zone.x + 8, zone.y + 6, zone.w - 16, zone.h - 12);
      ctx.globalAlpha = 0.5;
      for (let zx = zone.x + 10; zx < zone.x + zone.w - 8; zx += 4) {
        line(ctx, zx, zone.y + 8, zx + 2, zone.y + 8);
      }
      ctx.globalAlpha = 1;
      for (const dx of [-0.18, 0, 0.18]) {
        const filled = dx !== 0;
        ctx.globalAlpha = filled ? 0.9 : 0.3;
        line(ctx, cx + dx * zone.w, cy - 8, cx + dx * zone.w, cy + 8);
        ctx.globalAlpha = 1;
      }
      break;
    }
    case "wineRack": {
      const cols = 3;
      const rows = 2;
      const startX = zone.x + 6;
      const startY = zone.y + 6;
      const cellW = (zone.w - 12) / cols;
      const cellH = (zone.h - 12) / rows;

      ctx.strokeRect(startX, startY, cellW * cols, cellH * rows);
      ctx.globalAlpha = 0.55;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x0 = startX + c * cellW;
          const y0 = startY + r * cellH;
          line(ctx, x0, y0, x0 + cellW, y0 + cellH);
          line(ctx, x0 + cellW, y0, x0, y0 + cellH);
        }
      }
      ctx.globalAlpha = 1;

      const br = Math.min(cellW, cellH) * 0.34;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = startX + cellW * (c + 0.5);
          const by = startY + cellH * (r + 0.5);
          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(bx, by, br * 0.42, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
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
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(14, 10);
      ctx.quadraticCurveTo(11, 7, 14, 4);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx - 12, cy - 8, 1.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "trunk": {
      const open = flags.trunkOpen;
      const bodyX = zone.x + 8;
      const bodyY = zone.y + zone.h * 0.35;
      const bodyW = zone.w - 16;
      const bodyH = zone.h * 0.5;
      ctx.strokeRect(bodyX, bodyY, bodyW, bodyH);

      ctx.globalAlpha = 0.4;
      for (const t of [0.33, 0.66]) {
        line(
          ctx,
          bodyX + 2,
          bodyY + bodyH * t,
          bodyX + bodyW - 2,
          bodyY + bodyH * t,
        );
      }
      ctx.globalAlpha = 1;

      const bracket = Math.min(bodyW, bodyH) * 0.18;
      for (const [bx, by, sx, sy] of [
        [bodyX, bodyY, 1, 1],
        [bodyX + bodyW, bodyY, -1, 1],
        [bodyX, bodyY + bodyH, 1, -1],
        [bodyX + bodyW, bodyY + bodyH, -1, -1],
      ]) {
        ctx.beginPath();
        ctx.moveTo(bx + sx * bracket, by);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx, by + sy * bracket);
        ctx.stroke();
      }

      if (open) {
        ctx.beginPath();
        ctx.moveTo(bodyX, bodyY);
        ctx.lineTo(zone.x + zone.w * 0.3, zone.y + 6);
        ctx.lineTo(bodyX + bodyW, bodyY);
        ctx.stroke();
        for (const t of [0.22, 0.78]) {
          ctx.beginPath();
          ctx.arc(bodyX + bodyW * t, bodyY, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.strokeRect(bodyX, zone.y + zone.h * 0.22, bodyW, zone.h * 0.16);
        for (const t of [0.32, 0.68]) {
          const rx = zone.x + zone.w * t;
          const ropeTop = zone.y + zone.h * 0.2;
          const ropeBottom = zone.y + zone.h * 0.88;
          line(ctx, rx - 3, ropeTop, rx - 3, ropeBottom);
          line(ctx, rx + 3, ropeTop, rx + 3, ropeBottom);
          ctx.globalAlpha = 0.55;
          for (let ty = ropeTop + 3; ty < ropeBottom; ty += 5) {
            line(ctx, rx - 3, ty, rx + 3, ty + 3);
          }
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(cx, zone.y + zone.h * 0.35, 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.6;
        ctx.strokeRect(cx - 5, zone.y + zone.h * 0.35 + 5, 10, 6);
        ctx.globalAlpha = 1;
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
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + Math.PI / 16;
        line(
          ctx,
          cx + Math.cos(a) * s * 0.11,
          cy + Math.sin(a) * s * 0.11,
          cx + Math.cos(a) * s * 0.15,
          cy + Math.sin(a) * s * 0.15,
        );
      }
      ctx.globalAlpha = flags.trunkOpen ? 0.3 : 0.15;
      ctx.beginPath();
      ctx.arc(cx + s * 0.1, cy - s * 0.08, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case "bundle": {
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.22, cy - s * 0.02);
      ctx.bezierCurveTo(
        cx - s * 0.22,
        cy - s * 0.22,
        cx + s * 0.22,
        cy - s * 0.22,
        cx + s * 0.22,
        cy - s * 0.02,
      );
      ctx.bezierCurveTo(
        cx + s * 0.3,
        cy + s * 0.14,
        cx + s * 0.16,
        cy + s * 0.3,
        cx,
        cy + s * 0.32,
      );
      ctx.bezierCurveTo(
        cx - s * 0.16,
        cy + s * 0.3,
        cx - s * 0.3,
        cy + s * 0.14,
        cx - s * 0.22,
        cy - s * 0.02,
      );
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.14, cy + s * 0.04);
      ctx.quadraticCurveTo(cx, cy + s * 0.1, cx + s * 0.12, cy + s * 0.02);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.1, cy + s * 0.16);
      ctx.quadraticCurveTo(cx, cy + s * 0.21, cx + s * 0.1, cy + s * 0.15);
      ctx.stroke();
      ctx.globalAlpha = 1;
      line(ctx, cx - s * 0.14, cy - s * 0.09, cx + s * 0.14, cy - s * 0.09);
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.14, 1.8, 0, Math.PI * 2);
      ctx.fill();
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

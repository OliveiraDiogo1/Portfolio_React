import { createCanvas } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#0F1115';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

ctx.fillStyle = '#FDE048';
ctx.fillRect(0, 0, WIDTH, 10);

ctx.fillStyle = '#F1F3F6';
ctx.font = '700 96px "Segoe UI", Arial, sans-serif';
ctx.fillText('Diogo Oliveira', 80, 300);

ctx.fillStyle = '#98A0AD';
ctx.font = '400 38px "Segoe UI", Arial, sans-serif';
ctx.fillText('Full-stack developer, from requirements to production.', 80, 372);

ctx.strokeStyle = '#262B35';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(80, 430);
ctx.lineTo(WIDTH - 80, 430);
ctx.stroke();

ctx.fillStyle = '#FDE048';
ctx.font = '600 30px "Segoe UI", Arial, sans-serif';
ctx.fillText('devdiogo.pt', 80, 500);

mkdirSync('public', { recursive: true });
writeFileSync('public/og-cover.png', canvas.toBuffer('image/png'));
console.log('public/og-cover.png written');

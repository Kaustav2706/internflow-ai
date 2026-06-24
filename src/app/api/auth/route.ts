import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'missing' }, { status: 400 });

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ error: 'invalid' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: 'invalid' }, { status: 401 });

    const payload = { email: user.email, role: user.role, name: user.name };
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    const { password: pw, ...safe } = user as any;
    return NextResponse.json({ token, user: safe });
  } catch (err) {
    console.error('Auth error', err);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}

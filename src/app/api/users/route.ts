import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser, updateUserByEmail } from '@/lib/userStore';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'email required' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const { password, ...safe } = user as any;
    return NextResponse.json(safe);
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}

export async function POST(req: Request) {
  // Register new user
  try {
    const body = await req.json();
    const { name, email, password, role, team } = body;
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      team: team || null,
      joinDate: new Date().toISOString().split('T')[0],
      avatarUrl: role === 'admin' ? '/avatars/admin.png' : '/avatars/intern.png',
      streak: 0,
      tasksCompleted: 0,
      tasks: []
    };

    await createUser(newUser);
    const { password: pw, ...safe } = newUser as any;
    return NextResponse.json(safe, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'unable to register' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  // Update user (profile, tasks)
  try {
    const body = await req.json();
    const { email, updated } = body;
    if (!email || !updated) return NextResponse.json({ error: 'missing' }, { status: 400 });

    const updatedUser = await updateUserByEmail(email, updated);
    if (!updatedUser) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const { password, ...safe } = updatedUser as any;
    return NextResponse.json(safe);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'unable to update' }, { status: 500 });
  }
}

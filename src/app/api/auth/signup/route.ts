import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SignUpRequestBody;

  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, body, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json({ ok: true, user: data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "회원가입 실패" },
        { status: error.response?.status ?? 500 },
      );
    }
    return NextResponse.json({ message: "회원가입 실패" }, { status: 500 });
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  /**
   * Register — replicates Go's service.RegisterUser:
   *   1. Create user in auth.users via Supabase Admin API
   *   2. Insert into profiles (id = auth.users.id, name)
   *   3. Sign in to get access_token
   *   4. Return { token, full_name }
   *
   * Error parity:
   *   - "email já cadastrado" → 400
   *   - other → 400 (Go returns 400 for all register errors)
   */
  async register(dto: RegisterDto): Promise<{ token: string; full_name: string }> {
    const email = dto.email.trim().toLowerCase();
    const password = dto.password.trim();
    const name = dto.name ?? '';

    // 1. Create user in Supabase Auth (admin API → bypasses email confirmation).
    const { data: createData, error: createError } =
      await this.supabase.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError) {
      // Supabase returns "User already registered" for duplicates.
      if (createError.message.includes('already registered')) {
        throw new BadRequestException('email já cadastrado');
      }
      throw new BadRequestException(createError.message);
    }

    const userId = createData.user.id;

    // 2. Insert profile row (id = auth.users.id).
    try {
      await this.prisma.profile.create({
        data: { id: userId, email, name },
      });
    } catch {
      // Roll back: delete the auth user if profile insertion fails.
      await this.supabase.supabaseAdmin.auth.admin.deleteUser(userId);
      throw new InternalServerErrorException('erro ao salvar perfil');
    }

    // 3. Sign in to get an access_token (same as frontend would get).
    const { data: signInData, error: signInError } =
      await this.supabase.supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email,
      });

    // Fallback: use signInWithPassword via anon client.
    if (signInError || !signInData) {
      const { data: passwordSignIn, error: pwError } =
        await this.supabase.supabase.auth.signInWithPassword({ email, password });

      if (pwError || !passwordSignIn.session) {
        throw new InternalServerErrorException(
          'usuário criado, mas erro ao gerar token',
        );
      }

      return {
        token: passwordSignIn.session.access_token,
        full_name: name,
      };
    }

    // generateLink doesn't return a session directly, so sign in with password.
    const { data: sessionData, error: sessionError } =
      await this.supabase.supabase.auth.signInWithPassword({ email, password });

    if (sessionError || !sessionData.session) {
      throw new InternalServerErrorException(
        'usuário criado, mas erro ao gerar token',
      );
    }

    return {
      token: sessionData.session.access_token,
      full_name: name,
    };
  }

  /**
   * Login — replicates Go's service.LoginUser:
   *   1. Sign in with Supabase Auth (email + password)
   *   2. Fetch profile for name
   *   3. Return { token, full_name }
   *
   * Error parity:
   *   - "email ou senha inválidos" → 401
   */
  async login(dto: LoginDto): Promise<{ token: string; full_name: string }> {
    const email = dto.email.trim().toLowerCase();
    const password = dto.password.trim();

    const { data, error } = await this.supabase.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('email ou senha inválidos');
    }

    const userId = data.user.id;

    // Fetch profile to get name (may not exist for legacy users).
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    return {
      token: data.session.access_token,
      full_name: profile?.name ?? '',
    };
  }

  /**
   * Validate — replicates Go's controller.ValidateToken.
   * The guard already validated the JWT; we just confirm to the client.
   */
  validate(userId: string) {
    return {
      message: 'Token válido',
      user_id: userId,
    };
  }
}

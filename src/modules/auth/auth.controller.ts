import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { UserDocument } from "../user/entities/user.entity";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./dto/login-request.dto";
import { LocalAuthGuard } from "./guard/local-auth.guard";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginRequestDto })
    @Post("login")
    async login(@Req() req: Request) {
        return this.authService.login(req.user as UserDocument);
    }
}

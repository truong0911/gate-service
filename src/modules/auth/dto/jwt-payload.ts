export class JwtPayload {
    sub: {
        userId: string;
        authorizationVersion: number;
    };
    jti: string;
}
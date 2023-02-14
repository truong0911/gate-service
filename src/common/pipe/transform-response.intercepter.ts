import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseDto } from "../dto/response/response.dto";

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto> {
        return next.handle().pipe(
            map((data) => {
                const ctx = context.switchToHttp();
                const res = ctx.getResponse<Response>();
                if (data instanceof ResponseDto) {
                    data.statusCode = res.statusCode;
                }
                return data;
            }),
        );
    }
}

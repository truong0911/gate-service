import { SsoRole } from "@config/constant";
import { JwtSsoGuard } from "@module/auth/guard/jwt-sso.guard";
import { applyDecorators, HttpStatus, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthErrorCode } from "../../modules/auth/common/auth.constant";
import { SsoRolesGuard } from "../guard/sso-role.guard";
import { WorkspaceIpAddressGuard } from "../guard/workspace-ip-address.guard";
import { ApiErrorDoc } from "./api.decorator";

export const AllowSsoRole = (...ssoRoles: SsoRole[]) => {
    return SetMetadata("sso-roles", ssoRoles);
};

export const Authorization = () =>
    applyDecorators(
        UseGuards(
            // JwtAuthGuard,
            JwtSsoGuard,
            SsoRolesGuard,
            // TODO: SSO Guard
        ),
        ApiBearerAuth(),
    );

export const WorkspaceAuthorization = () =>
    applyDecorators(
        UseGuards(
            // JwtAuthGuard,
            JwtSsoGuard,
            SsoRolesGuard,
            WorkspaceIpAddressGuard,
        ),
        ApiBearerAuth(),
        ApiErrorDoc(HttpStatus.UNAUTHORIZED, [
            {
                errorCode: AuthErrorCode.UNAUTHORIZED_WRONG_IDENTIFY_DEVICE,
                errorDescription: "Thiết bị đang sử dụng không phải thiết bị đã xác thực",
            },
            {
                errorCode: AuthErrorCode.UNAUTHORIZED_WRONG_WORKSPACE_IP_ADDRESS,
                errorDescription: "Không sử dụng địa chỉ mạng của nơi làm việc",
            },
        ]),
    );

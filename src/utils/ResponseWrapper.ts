import { ResponseObject } from "../interfaces/ResponseObject";

export class ResponseWrapper {
    static success(data: any, status: number = 200): ResponseObject {
        return { success: true, status, data };
    }

    static error(message: string, status: number = 500): ResponseObject {
        return { success: false, status, data: { error: message } };
    }

    static ok(status: number = 204): ResponseObject {
        return { success: true, status, data: {} };
    }

    static created(data: any, status: number = 201): ResponseObject {
        return { success: true, status, data };
    }

    static unauthorized(): ResponseObject {
        return { success: false, status: 401, data: { error: "Not authorized" }};
    }
}
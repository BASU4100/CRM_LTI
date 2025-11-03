import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            const TOKEN = this.authService.getToken();
    
            // Skip interceptor for login and register endpoints
            if (req.url.includes("login") || req.url.includes("register")) {
                return next.handle(req);
            }
    
            // Prepare headers
            let headers : {[key:string]:string}  = {
                Authorization: TOKEN ? `Bearer ${TOKEN}` : '',
                Accept: "application/json"
            };
    
            // Only set Content-Type for non-FormData requests
            if (!(req.body instanceof FormData)) {
                headers["Content-Type"] = "application/json; charset=utf-8";
            }
    
            // Clone request with headers
            const modifiedReq = req.clone({
                setHeaders: headers
            });
    
            return next.handle(modifiedReq);
        }
}
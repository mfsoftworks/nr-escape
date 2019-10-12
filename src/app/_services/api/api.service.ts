import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';
import { Post } from '../../_models/post';
import { Comment } from '../../_models/comment';
import { Profile } from '../../_models/profile';
import { Notification } from '../../_models/notification';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private http: HttpClient,
        private userService: UserService,
        public errorToast: MatSnackBar,
        private zone: NgZone
    ) {}

    // API: Sign Up User
    signUp(username: string, password: string, email: string): any {
        return this.http
        .post(`${API_URL}/signup`, {
            username,
            password,
            email
        }, this.getRequestHeaders())
        .pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // API: Sign In User
    signIn(username: string, password: string): any {
        return this.http
        .post(`${API_URL}/login`, {
            username,
            password
        }, this.getRequestHeaders())
        .pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // API: Send User Forgot Password Request
    forgotPassword(email: string): any {
        return this.http
        .post(`${API_URL}/forgot`, {
            email
        }, this.getRequestHeaders())
        .pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // API: Reset User Password
    resetPassword(token: string, email: string, password: string, passwordConfirmation: string): any {
        return this.http
        .post(`${API_URL}/reset`, {
            token,
            email,
            password,
            password_confirmation: passwordConfirmation
        }, this.getRequestHeaders())
        .pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // API: Get User Profile
    getUser(): Observable<Profile> {
        return this.http
        .get<Profile>(`${API_URL}/me`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Update User Profile
    updateUser(user: Profile): Observable<Profile> {
        return this.http
        .put<Profile>(`${API_URL}/me/update`,
            user,
            this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Deactivate user profile
    deactivateProfile(): any {
        return this.http
        .post(`${API_URL}/me/deactivate`, null, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Save FCM Token
    saveFcm(token: string): any {
        return this.http
        .post(`${API_URL}/me/fcm/token`, { token }, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Subscribe to FCM Topic
    subscribeFcm(token: string, topic: string): any {
        return this.http
        .post(`${API_URL}/me/fcm/subscribe/${topic}`, { token }, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Unsubcribe from FCM Topic
    unsubscribeFcm(token: string, topic: string): any {
        return this.http
        .post(`${API_URL}/me/fcm/unsubscribe/${topic}`, { token }, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: User search
    search(query: string, type: string): Observable<any[]> {
        return this.http
        .get<any[]>(`${API_URL}/search?query=${query}${type ? `&type=${type}` : ``}`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Get User Feed
    getUserFeed(): Observable<Post[]> {
        return this.http
        .get<Post[]>(`${API_URL}/me/feed`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error)),
            map((response) => response.map(
                post => new Post(post)
            ))
        );
    }

    // API: Get Recommended Users
    getRecommendations(): Observable<Post[]> {
        return this.http
        .get<any[]>(`${API_URL}/me/recommendations`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error)),
            map((response) => response[0].map(
                recommendation => new Post(recommendation)
            ))
        );
    }

    // API: Get User Engagement Score
    getEngagementScore(): any {
        return this.http
        .get(`${API_URL}/me/engagement`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Get User Notifications
    getUserNotifications(): Observable<Notification[]> {
        return this.http
        .get<Notification[]>(`${API_URL}/me/notifications`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error)),
            map((response) => response.map(
                notification => new Notification(notification)
            ))
        );
    }

    // API: Get Notification
    getNotification(id: number): Observable<Notification> {
        return this.http
        .get<Notification>(`${API_URL}/notification/${id}`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Get Profile
    getProfile(username: string): Observable<Profile> {
        return this.http
        .get<Profile>(`${API_URL}/profile/${username}`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error)),
            map(profile =>
                new Profile(profile)
            )
        );
    }

    // API: Get User Posts
    getProfilePosts(id: number, offset: number): Observable<Post[]> {
        return this.http
        .get<Post[]>(`${API_URL}/profile/${id}/posts?offset=${offset}`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error)),
            map((response) => response.map(
                post => new Post(post)
            ))
        );
    }

    // API: Get Post
    getPost(id: number): Observable<Post> {
        return this.http
        .get<Post>(`${API_URL}/post/${id}`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Create Post
    addPost(post: any): Observable<Post> {
        return this.http
        .post<Post>(`${API_URL}/post`, post, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error)),
            map((response) => new Post(response))
        );
    }

    // API: Update Post
    updatePost(id: number, post: Post): Observable<Post> {
        return this.http
        .put<Post>(`${API_URL}/post/${id}`, post, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Delete Post
    deletePost(id: number): any {
        return this.http
        .delete(`${API_URL}/post/${id}`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Get Comment
    getComment(id: number): Observable<Comment> {
        return this.http
        .get<Comment>(`${API_URL}/comment/${id}`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Create Comment
    addComment(comment: Comment): Observable<Comment> {
        return this.http
        .post<Comment>(`${API_URL}/comment`, comment, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Update Comment
    updateComment(id: number, comment: Comment): Observable<Comment> {
        return this.http
        .put<Comment>(`${API_URL}/comment/${id}`, comment, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Delete Comment
    deleteComment(id: number): any {
        return this.http
        .delete(`${API_URL}/comment/${id}`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Follow user
    followUser(id: number): any {
        return this.http
        .post(`${API_URL}/profile/${id}/follow`, null, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Unfollow user
    unfollowUser(id: number): any {
        return this.http
        .post(`${API_URL}/profile/${id}/unfollow`, null, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Like Post
    likePost(id: number): any {
        return this.http
        .post(`${API_URL}/post/${id}/like`, null, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Unlike Post
    unlikePost(id: number): any {
        return this.http
        .delete(`${API_URL}/post/${id}/like`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Block User
    blockUser(id: number): any {
        return this.http
        .post(`${API_URL}/profile/${id}/block`, null, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Unblock User
    unblockUser(id: number): any {
        return this.http
        .post(`${API_URL}/profile/${id}/unblock`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Report User
    reportUser(id: number): any {
        return this.http
        .post(`${API_URL}/profile/${id}/report`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // API: Report Post
    reportPost(id: number): any {
        return this.http
        .post(`${API_URL}/post/${id}/report`, this.getRequestHeaders())
        .pipe(
            retry(1),
            catchError((error) => this.handleError(error))
        );
    }

    // Error handling
    handleError(error: any) {
        // DEBUG:
        console.warn(error);

        // Set error message
        const errorMessage = (error instanceof HttpErrorResponse)
            ? `(${error.name}) Message: ${error.statusText}`
            : `(${error.status}) Message: ${error.error}`;

        // Open error snackbar
        this.errorToast.open(errorMessage, 'close', {
            duration: 3000
        });


        return throwError(errorMessage);
    }

    // Http Headers
    private getRequestHeaders() {
        const headers = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/json',
                Authorization: (this.userService.token) ? `Bearer ${this.userService.token}` : ''
            })
        };
        return headers;
    }
}

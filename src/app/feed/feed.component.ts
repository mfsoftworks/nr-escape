import { Component, OnInit } from '@angular/core';

import { UserService } from '../user/user.service';
import { User } from '../user';
import { Post } from '../post';

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
    posts: Post[] = [];
    user: User;
    post: Post;

    constructor(private userService: UserService) {
        this.user = this.userService.user;
    }

    public ngOnInit() {
        this.userService.getUserFeed().subscribe((feed) => {
            this.posts = feed;
            console.log(this.posts);
        });
    }

    // Update for API usage
    likePost(post: Post) {
        switch (this.isLiked(post)) {
            // If post is liked, remove like
            case true:
                for (let i = 0; i < post.likes.length; i++) {
                    if (post.likes[i] === this.user.id) { post.likes.splice(i, 1); }
                }
                break;

            // If not liked add a new like
            case false:
                post.likes.push(this.user.id);
                break;
        }

        // DEBUG: Log post data
        console.log(post.likes);
    }

    isLiked(post: Post) {
        return post.likes.includes(this.user.id);
    }

    repost(post: Post) { }
}

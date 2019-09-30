import { Profile } from './profile';
import { Comment } from './comment';

export class Post {
    id: number;
    author: Profile;
    createdAt: string;
    type: string;
    media: string;
    caption: string;
    repost: boolean;
    repostOf: Post;
    comments: Comment[];
    likes: any[];

    constructor(values: any = {}) {
        Object.assign(this, values);
    }
}

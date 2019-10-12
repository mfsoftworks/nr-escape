import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { SignedInGuard } from './_helpers/signed-in.guard';
import { FeedResolver } from './_helpers/feed.resolver';
import { RecommendationsResolver } from './_helpers/recommendations.resolver';
import { HashtagResolver } from './_helpers/hashtag.resolver';
import { NotificationsResolver } from './_helpers/notifications.resolver';
import { ProfileResolver } from './_helpers/profile.resolver';
import { PostResolver } from './_helpers/post.resolver';
import { FeedComponent } from './feed/feed.component';
import { NewPostComponent } from './new-post/new-post.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchComponent } from './search/search.component';
import { HashtagListingComponent } from './hashtag-listing/hashtag-listing.component';
import { NotFound404Component } from './not-found404/not-found404.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [ SignedInGuard ],
        children: [
            {
                path: '',
                component: FeedComponent,
                resolve: { posts: FeedResolver },
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'recommendations',
                component: RecommendationsComponent,
                resolve: { recommendations: RecommendationsResolver },
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'search',
                component: SearchComponent,
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'hashtag/:hashtag',
                component: HashtagListingComponent,
                resolve: { posts: HashtagResolver },
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'new-post',
                component: NewPostComponent,
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'post/:postId',
                component: PostComponent,
                resolve: { post: PostResolver },
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'notifications',
                component: NotificationsComponent,
                resolve: { notifications: NotificationsResolver },
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'profile/:profile',
                component: ProfileComponent,
                resolve: { profile: ProfileResolver },
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'settings',
                component: SettingsComponent,
                runGuardsAndResolvers: 'always'
            }
        ],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'sign-in',
        loadChildren: './_modules/authentication/authentication.module#AuthenticationModule'
    },
    {
        path: 'login',
        redirectTo: '/sign-in',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFound404Component
    }
];
const options: ExtraOptions = {
    useHash: false,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
};

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes, options);

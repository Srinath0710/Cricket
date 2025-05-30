import { Route } from "@angular/router";
import { AllComponentComponent } from "./all-component.component";
import { PlayerRegistrationComponent } from "./player-registration/player-registration.component";
import { RoleMenuComponent } from "./role-menu/role-menu.component";
import { CountryComponent } from "./country/country.component";
import { OfficialsComponent } from "./officials/officials.component";
import { CompetitionComponent } from "./competition/competition.component";
import { TeamsComponent } from "./teams/teams.component";
import { StateComponent } from "./state/state.component";
import { AllCitiesComponent } from "./all-cities/all-cities.component";
import { SeasonsComponent } from "../seasons/seasons.component";
import { GroundsComponent } from "../grounds/grounds.component";
// import { ScoreEnginesComponent } from "../score-engines/score-engines.component";
import { ScoreEngineComponent } from "../score-engine/score-engine.component";
import { ClientComponent } from "./client/client.component";

export const AllComponentRoutes: Route[] = [
    {
        path: '',
        component: AllComponentComponent,
        children:[
            {
                path: '',
                redirectTo: 'country',
                pathMatch: 'full',
            },
            {
                path: 'roles',
                component: RoleMenuComponent
            },
            {
                path: 'players',
                component: PlayerRegistrationComponent
            },
            {
                path: 'country',
                component: CountryComponent
            },
            {
                path: 'officials',
                component: OfficialsComponent
            },
            {
                path: 'tournament',
                component: CompetitionComponent
            },
            {
                path: 'teams',
                component: TeamsComponent
            },
            {
                path: 'state',
                component: StateComponent
            },
            {
                path: 'city',
                component: AllCitiesComponent
            },
            {
                path: 'seasons',
                component: SeasonsComponent
            },
            {
                path: 'ground',
                component: GroundsComponent
            },
            // {
            //     path: 'score-cards',
            //     component: ScoreEnginesComponent

            // },
         
            {
                path: 'score-card',
                component: ScoreEngineComponent

            },
            {
                path: 'client',
                component: ClientComponent

            },
         
        ]

    },
]
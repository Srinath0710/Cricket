import { Route } from "@angular/router";
import { AllComponentComponent } from "./all-component.component";
import { PlayerRegistrationComponent } from "./player-registration/player-registration.component";
import { RoleMenuComponent } from "./role-menu/role-menu.component";
import { CountryComponent } from "../country/country.component";
import { OfficialsComponent } from "./officials/officials.component";
import { CompetitionComponent } from "./competition/competition.component";
import { TeamsComponent } from "../teams/teams.component";
import { StateComponent } from "./state/state.component";
import { AllCitiesComponent } from "./all-cities/all-cities.component";
import { SeasonsComponent } from "../seasons/seasons.component";
// import { AllGroundsComponent } from "./all-grounds/all-grounds.component";
export const AllComponentRoutes: Route[] = [
    {
        path: '',
        component: AllComponentComponent,
        children:[
            {
                path: '',
                redirectTo: 'player',
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
                path: 'compitition',
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
            // {
            //     path: 'grounds',
            //     component: AllGroundsComponent
            // },
         
         
        ]

    },
]
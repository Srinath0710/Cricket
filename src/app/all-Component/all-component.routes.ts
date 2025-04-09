import { Route } from "@angular/router";
import { AllComponentComponent } from "./all-component.component";
import { PlayerRegistrationComponent } from "./player-registration/player-registration.component";
import { RoleMenuComponent } from "./role-menu/role-menu.component";
import { CountryComponent } from "../country/country.component";
import { OfficialsComponent } from "./officials/officials.component";
import { CompetitionComponent } from "./competition/competition.component";
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
                path: 'player',
                component: PlayerRegistrationComponent
            },
            {
                path: 'country',
                component: CountryComponent
            },
            {
                path: 'official',
                component: OfficialsComponent
            },
            {
                path: 'compitition',
                component: CompetitionComponent
            },
          
        ]
    },
]
import { Route } from "@angular/router";
import { AllComponentComponent } from "./all-component.component";
export const AllComponentRoutes: Route[] = [
    {
        path: '',
        component: AllComponentComponent,
        children:[
            {
                path: '',
                redirectTo: 'client',
                pathMatch: 'full',
            },
          
        ]
    },
]
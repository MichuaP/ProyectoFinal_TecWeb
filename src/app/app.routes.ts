import { Routes } from '@angular/router';
import { RegistroCitasComponent } from './citas/registro-citas/registro-citas.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { HomeComponent } from './home/home.component';
import { MedicosComponent } from './medicos/medicos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { UnaespecialidadComponent } from './unaespecialidad/unaespecialidad.component';
import { SearchComponent } from './search/search.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { EquipoComponent } from './equipo/equipo.component';
import { ContactoComponent } from './contacto/contacto.component';
import { GraficasComponent } from './graficas/graficas.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { AbcComponent } from './abc/abc.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
    { path:'regCitas', component: RegistroCitasComponent },
    { path:'registro', component: RegistroComponent },
    { path:'nosotros', component: NosotrosComponent },
    { path: 'servicios', component: ServiciosComponent },
    { path: 'inicio', component: HomeComponent },
    { path: 'nuestrosMedicos', component: MedicosComponent },
    { path: 'reportes', component: ReportesComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'equipo', component: EquipoComponent },
    { path: 'graficas', component: GraficasComponent },
    { path: 'ayuda', component: AyudaComponent },
    { path: 'abc', component: AbcComponent },
    { path: 'especialidad/:id', component: UnaespecialidadComponent },
    { path: 'buscador/:nombreEsp', component: SearchComponent },
    {path: '**', pathMatch: 'full', redirectTo: 'inicio'}
];

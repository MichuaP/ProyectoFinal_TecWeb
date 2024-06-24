import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-graficas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graficas.component.html',
  styleUrl: './graficas.component.css',
})
export class GraficasComponent implements OnInit {
  public chart: Chart;
  public datos: number[];
  public titulos: string[];

  constructor(public myAuth: AuthService) {
    this.myAuth.getCitas().subscribe(
      (data) => {
        console.log(data, 'dataengraficas');
        console.log(data, 'dataengraficas');

        // Inicializar un objeto para contar las especialidades
        let especialidadConteo: { [key: string]: number } = {};

        data.forEach((cita: any) => {
          let especialidad = cita.especialidad;
          if (especialidadConteo[especialidad]) {
            especialidadConteo[especialidad]++;
          } else {
            especialidadConteo[especialidad] = 1;
          }
        });

        console.log(especialidadConteo, 'conteo de especialidades');
        
        this.titulos = [
          'Diagnóstico clínico',
          'Medicina General',
          'Oftalmología',
          'Cardiología',
          'Dermatología',
          'Ginecología y Obstetricia',
          'Neurología',
          'Pediatría',
          'Oncología',
          'Ortopedia y Traumatología',
          'Endocrinología',
          'Psiquiatría',
          'Geriatría',
        ];

        console.log(this.titulos);

        console.log("before") //NO QUITAR
        this.datos = this.titulos.map(label => especialidadConteo[label] || 0);
        console.log(this.datos,"Valores datos")

        let datos = {
          labels: this.titulos,
          datasets: [
            {
              label: 'Pacientes',
              data: this.datos,
              borderColor: 'rgb(0, 219, 135)',
              backgroundColor: 'rgb(0, 172, 106)',
            },
          ],
        };

        this.chart = new Chart('chart', {
          type: 'bar',
          data: datos,
          options: {
            indexAxis: 'x',
            elements: {
              bar: {
                borderWidth: 2,
              },
            },
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: 'Pacientes ingresados',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Especialidad asistida',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Pacientes ingresados',
                },
              },
            },
          },
        });
      },
      (error) => {
        alert('Error al ingresar');
      }
    );
  }

  ngOnInit(): void {}
}

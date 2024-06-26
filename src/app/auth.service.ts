import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithPhoneNumber, updateProfile, user } from '@angular/fire/auth';
import { RecaptchaVerifier, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Database, get, push, ref, set, remove } from '@angular/fire/database';
import { Observable, from, map } from 'rxjs';
import { Paciente } from './paciente';
import { Cita, CitaConID, FechaOcupada, HorasOcupadas } from './medico';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseAuth: Auth, private database: Database) {}

  user$ = user(this.firebaseAuth);
  currentUserSig = signal<Paciente | null | undefined> (undefined)
  confirmationResult: any;
  users!: Paciente[];
  captchaVerifier: RecaptchaVerifier | undefined;

  //Función para registrar un usuario
  register(correo: string, nombre: string, apellido: string, contraseña:string, telefono:string, fecha:string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      correo,
      contraseña
    ).then(response => {
      return updateProfile(response.user, {displayName:nombre}).then(() =>{
        //GUardar en database realtime
        const userUID = response.user.uid;
        return set(ref(this.database, 'users/' + userUID),{
          nombre:nombre,
          apellido:apellido,
          correo:correo,
          telefono:telefono,
          fecha:fecha,
        });
      });
    });
    return from(promise);
  }

  //Login con email and password
  login(email:string, password:string):Observable<any>{
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then((userCredential) => {
      return userCredential.user.displayName;
    });
    return from(promise);
  }

  //Logout
  logout():Observable<void>{
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  getDatos(): Observable<Paciente[]> {
    const horasRef = ref(this.database, 'users');
    const promise = get(horasRef).then((snapshot) => {
      const fechasOcupadas: Paciente[] = [];
      if (snapshot.exists()) {
        //Obtenermos el array
        snapshot.forEach((childSnapshot) => {
          const fechas = childSnapshot.val();
          fechasOcupadas.push({
            nombre: fechas.nombre,
            apellido: fechas.apellido,
            correo: fechas.correo,
            telefono: fechas.telefono,
            fecha: fechas.fecha
          });
        });
      }
      return fechasOcupadas;
    });
    return from(promise);
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user) // Mapeamos el usuario a un booleano
    );
  }

  //Inicializar captcha
  initializeRecaptcha(element: HTMLElement):void {
    this.captchaVerifier = new RecaptchaVerifier(this.firebaseAuth,element, {});
    this.captchaVerifier.render().then(widgetId => {
      console.log("reCAPTCHA widget ID:", widgetId);
      return true;
    });
  }


  
  //Funcion para enviar el código al número de telefono
  sendCode(phone: string): Observable<void> {
    if (!this.captchaVerifier) {
      throw new Error("Captcha verifier is not initialized");
    }
    const promise = signInWithPhoneNumber(this.firebaseAuth, phone, this.captchaVerifier)
      .then(confirmationResult => {
        this.confirmationResult = confirmationResult;
        console.log("SMS sent");
      });
    return from(promise);
  }

  //Función para ingresar con el número de teléfono
  loginSMS(code: string): Observable<void> {
    if (!this.confirmationResult) {
      throw new Error("Confirmation result is not available");
    }
    const promise = this.confirmationResult.confirm(code)
      .then(() => {
        console.log("exito al ingresar");
      })
      .catch(() => {
        alert("Error con el código");
      })as Promise<void>;
    return from(promise);
  }

  //Función que lee la base de datos y verifica si el usuario existe
  existe(tel: string): Promise<boolean> {
    const usersRef = ref(this.database, 'users');
    return get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        let flag = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          const phone = userData.telefono;
          const username = userData.nombre;
          console.log("Phone:", phone);
          if (tel === phone) {
            console.log("Existe cuenta, proceder");
            flag = true;
          }
        });
        return flag;
      } else {
        console.log("No se encontraron usuarios");
        return false;
      }
    }).catch((error) => {
      console.error("Error al obtener usuarios:", error);
      return false;
    });
  }

  //Función que obtiene todos los usuarios de una base de datos
  getUsuarios(): Promise<Paciente[]> {
    const usersRef = ref(this.database, 'users');
    return get(usersRef)
      .then((snapshot) => {
        const users: Paciente[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            users.push({
              nombre: userData.nombre,
              apellido: userData.apellido,
              correo: userData.correo,
              fecha: userData.fecha,
              telefono: userData.telefono,
            });
          });
        } else {
          console.log("No se encontraron usuarios");
        }
        return users;
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        return [];
      });
  }

  //Obtener los datos de las citas
  getCitas(): Observable<CitaConID[]> {
    const citasRef = ref(this.database, 'citas');
    const promise = get(citasRef).then((snapshot) => {
      const citas: CitaConID[] = [];
      if (snapshot.exists()) {
        //Obtenermos el array
        snapshot.forEach((childSnapshot) => {
          const citasData = childSnapshot.val();
          citas.push({
            id: childSnapshot.key,
            nombrePaciente: citasData.nombrePaciente,
            telefono: citasData.telefono,
            costo: citasData.costo,
            nombreDoctor: citasData.doctor,
            especialidad: citasData.especialidad,
            fecha: citasData.fecha,
            hora: citasData.hora
          });
        });
      }
      return citas;
    });
    return from(promise);
  }

  eliminarCita(id: string): Observable<void> {
    const citaRef = ref(this.database, `citas/${id}`); //Referencia a eliminar

    return new Observable<void>((observer) => {
      remove(citaRef)
        .then(() => {
          observer.next(); //Operación exitosa
          observer.complete(); //Completar Observable
        })
        .catch((error) => {
          console.error('Error al eliminar la cita:', error);
          observer.error(error);
        });
    });
    
  }

  //Obtener las fechas y horas ocupadas de las citas
  getHorasOcupadas(): Observable<HorasOcupadas[]> {
    const horasRef = ref(this.database, 'horasOcupadas');
    const promise = get(horasRef).then((snapshot) => {
      const horas: HorasOcupadas[] = [];
      if (snapshot.exists()) {
        //Obtenermos el array
        snapshot.forEach((childSnapshot) => {
          const horasData = childSnapshot.val();
          horas.push({
            id: childSnapshot.key,
            fecha: horasData.fecha,
            hora: horasData.hora,
          });
        });
      }
      return horas;
    });
    return from(promise);
  }

  eliminarHorasOcupadas(id: string): Observable<void> {
    const horasRef = ref(this.database, `horasOcupadas/${id}`); //Referencia a eliminar

    return new Observable<void>((observer) => {
      remove(horasRef)
        .then(() => {
          observer.next(); //Operación exitosa
          observer.complete(); //Completar Observable
        })
        .catch((error) => {
          console.error('Error al eliminar la fecha y hora:', error);
          observer.error(error);
        });
    });
  }

  //Función para registrar un usuario
  agregarCita(infoCita: Cita): Observable<void> {
    const citasRef = ref(this.database, 'citas');
    const nuevaRef = push(citasRef);
    const promise = set(nuevaRef, {
      nombrePaciente: infoCita.nombrePaciente,
      telefono: infoCita.telefono,
      costo: infoCita.costo,
      doctor: infoCita.nombreDoctor,
      especialidad: infoCita.especialidad,
      fecha: infoCita.fecha,
      hora: infoCita.hora
    });
    return from(promise);
  }

  //Función para obtener las fechas ocupadas
  getFechasOcupadas(): Observable<FechaOcupada[]> {
    const horasRef = ref(this.database, 'horasOcupadas');
    const promise = get(horasRef).then((snapshot) => {
      const fechasOcupadas: FechaOcupada[] = [];
      if (snapshot.exists()) {
        //Obtenermos el array
        snapshot.forEach((childSnapshot) => {
          const fechas = childSnapshot.val();
          fechasOcupadas.push({
            fecha: fechas.fecha,
            hora: fechas.hora
          });
        });
      }
      return fechasOcupadas;
    });
    return from(promise);
  }

  //Funcion para guardar una fecha
  guardarFechasOcupadas(fechaOcupada: FechaOcupada): Observable<void> {
    const citasRef = ref(this.database, 'horasOcupadas');
    const nuevaCitaRef = push(citasRef); //Crea un nuevo id
    const promise = set(nuevaCitaRef, fechaOcupada);
    return from(promise);
  }

}

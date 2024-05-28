import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-datosBasicos',
    templateUrl: './datosBasicos.component.html',
    styleUrls: ['./datosBasicos.component.scss']
})
export class formularioDatosBasicos implements OnInit {

    /*
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    */

    datosBasicosForm: FormGroup;
    submitted: boolean = false;
    router: any;

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        if (this.session['rol'] != 'ROL_ADMIN' && this.session['rol'] != 'ROL_GP' && this.session['rol'] != 'ROL_LP' && this.session['rol'] != 'ROL_DP') {
            this.router.navigate(['/error']);
            return;
        }

    }

    get rf() { return this.datosBasicosForm.controls; }

    onSubmit() {
        this.submitted = true;
    }

}

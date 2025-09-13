import {Component, NgModule, OnInit} from '@angular/core';
import {FormGroup, FormsModule, NgForm, NgModel, ReactiveFormsModule} from '@angular/forms';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {Employee} from './employee';
import {EmployeeService} from './employee.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-employees',
  imports: [FormsModule, ReactiveFormsModule, RouterOutlet, NgFor, NgIf, RouterLink, CommonModule],
  templateUrl: './employees.component.html',
  standalone: true,
  styleUrl: './employees.component.css'
})

export class EmployeesComponent implements OnInit {
  public employees: Employee[] | any;
  public ModalTitle: string = '';
  public tempEmployee: Employee | any;
  private results: Employee[] = [];

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  private getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  private addEmployee(form: NgForm): void {

    this.employeeService.addEmployee(form.value).subscribe(res => {
        alert("successfully added!");
        this.getEmployees();
        form.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  private updateEmployee(form: NgForm): void {
    this.employeeService.updateEmployee(form.value).subscribe(res => {
        this.getEmployees();
        alert("successfully updated!");
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public saveEmployee(form: NgForm): void {
    if (this.ModalTitle === 'Add Employee') {
      this.addEmployee(form);
    } else {
      this.updateEmployee(form);
    }
  }

  private changeTitle(title: string): void {
    this.ModalTitle = title;
  }

  public onOpenModal(item: Employee | null, mod: string): void {
    this.changeTitle(mod);

    this.tempEmployee = item;
  }

  public onDeleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(res => {
        this.getEmployees();
        alert("successfully deleted!");
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployee(value: string): void {
    if (value===''){
      this.getEmployees();
    }
    this.results=[];
    for (const item of this.employees) {
      if ((item.name.toLowerCase().includes(value.toLowerCase()) ) ||
          (item.email.toLowerCase().includes(value.toLowerCase()) ) ||
          (item.phone.toLowerCase().includes(value.toLowerCase()) ) ||
        (item.jobTitle.toLowerCase().includes(value.toLowerCase()))){
        this.results.push(item);
      }
    }
    this.employees = this.results;
  }
}


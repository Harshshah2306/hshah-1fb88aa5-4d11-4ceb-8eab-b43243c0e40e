import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  user: any = null;
  todo: any[] = [];
  inProgress: any[] = [];
  done: any[] = [];
  newTaskTitle: string = '';

  
  users: any[] = [];           // Stores the list of people you can assign to
  selectedUserId: string = ''; // Stores the ID selected in the dropdown
  
  editingTaskId: number | null = null; // Tracks which task is being edited
  editedTitle: string = '';            // Stores the text while you type

  router = inject(Router);
  http = inject(HttpClient);
  cd = inject(ChangeDetectorRef);

  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(userString);
    
    this.fetchTasks();

    // 👇 2. LOAD USERS IF ADMIN/OWNER
    // (Viewers don't need to see the list of other users)
    if (this.canEdit) {
      this.fetchUsers();
    }
  }

  get canEdit(): boolean {
    return this.user?.role === 'OWNER' || this.user?.role === 'ADMIN';
  }

  getHeaders() {
    const token = localStorage.getItem('token'); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
    };
  }

  // 👇 3. NEW FUNCTION TO FETCH USERS
  fetchUsers() {
    this.http.get<any[]>('http://localhost:3000/api/users', this.getHeaders())
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (err) => console.error('Failed to fetch users', err)
      });
  }

  fetchTasks() {
    this.http.get<any[]>('http://localhost:3000/api/tasks', this.getHeaders())
      .subscribe({
        next: (tasks) => {
          this.todo = tasks.filter(t => t.status === 'OPEN');
          this.inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
          this.done = tasks.filter(t => t.status === 'DONE');
          // this.cd.detectChanges();
          this.cd.markForCheck();
        },
        error: (err) => console.error('Failed to fetch tasks', err)
      });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    const payload = { 
      title: this.newTaskTitle, 
      status: 'OPEN',
      assignedToId: this.selectedUserId // <--- Send the ID (or undefined if empty)
    };

    this.http.post('http://localhost:3000/api/tasks', payload, this.getHeaders())
      .subscribe(() => {
        this.newTaskTitle = '';
        this.selectedUserId = ''; // Reset the dropdown
        this.fetchTasks();
      });
  }

  startEdit(task: any) {
    this.editingTaskId = task.id;
    this.editedTitle = task.title; // Pre-fill the box with current title
  }

  
  cancelEdit() {
    this.editingTaskId = null;
    this.editedTitle = '';
  }

  
  saveEdit(task: any) {
    if (!this.editedTitle.trim()) return;

    const oldTitle = task.title; // Backup in case API fails
    
    // 1. Optimistic Update (Update screen immediately)
    task.title = this.editedTitle; 
    this.editingTaskId = null; 

    // 2. Send to Backend
    this.http.patch(`http://localhost:3000/api/tasks/${task.id}`, { title: this.editedTitle }, this.getHeaders())
      .subscribe({
        error: () => {
          alert('Failed to update task');
          task.title = oldTitle; // Revert if server fails
        }
      });
  }

  deleteTask(id: number) {
    if(confirm('Are you sure?')) {
      // 1. OPTIMISTIC UPDATE: Remove it from the screen INSTANTLY
      this.todo = this.todo.filter(t => t.id !== id);
      this.inProgress = this.inProgress.filter(t => t.id !== id);
      this.done = this.done.filter(t => t.id !== id);
      
      // Force screen refresh immediately
      this.cd.detectChanges(); 

      // 2. Send the request to the backend silently
      this.http.delete(`http://localhost:3000/api/tasks/${id}`, this.getHeaders())
        .subscribe({
          next: () => {
            // Success - do nothing, it's already gone from the screen!
          },
          error: () => {
             // If error, maybe show an alert or fetch tasks again to put it back
             alert('Could not delete task');
             this.fetchTasks();
          }
        });
    }
  }

  drop(event: CdkDragDrop<any[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const task = event.container.data[event.currentIndex];
      
      this.http.patch(`http://localhost:3000/api/tasks/${task.id}`, { status: newStatus }, this.getHeaders())
        .subscribe();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
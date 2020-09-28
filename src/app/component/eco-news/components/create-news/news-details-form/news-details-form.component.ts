import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FilterModel} from '@eco-news-models/create-news-interface';
import {CreateEcoNewsService} from '@eco-news-service/create-eco-news.service';
import {CancelPopUpComponent} from '@shared/components';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-news-details-form',
  templateUrl: './news-details-form.component.html',
  styleUrls: ['./news-details-form.component.scss']
})
export class NewsDetailsFormComponent implements OnInit {
  public isPosting = false;
  public isArrayEmpty = true;
  public isFilterValidation = false;
  public isLinkOrEmpty = true;
  public formData: FormGroup;
  public year: number = new Date().getFullYear();
  public day: number = new Date().getDate();
  public month: number = new Date().getMonth();
  public author: string = localStorage.getItem('name');

  public textAreasHeight = {
    minTextAreaScrollHeight: 50,
    maxTextAreaScrollHeight: 128,
    minTextAreaHeight: '48px',
    maxTextAreaHeight: '128px',
  };

  public filters: Array<FilterModel> = [
    {name: 'News', isActive: false},
    {name: 'Events', isActive: false},
    {name: 'Education', isActive: false},
    {name: 'Initiatives', isActive: false},
    {name: 'Ads', isActive: false}
  ];

  title = this.fb.control('');
  source = this.fb.control('');
  content = this.fb.control('');
  tags = this.fb.control([]);
  image = this.fb.control('');

  formGroup = this.fb.group({
    title: this.title,
    source: this.source,
    content: this.content,
    tags: this.tags,
    image: this.image,
  });

  constructor(
    private fb: FormBuilder,
    public createEcoNewsService: CreateEcoNewsService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  private setFormItems(): void {
    if (this.createEcoNewsService.isBackToEditing) {
      this.formData = this.createEcoNewsService.getFormData();
      if (this.formData) {
        this.patchFilters();
        this.formGroup.patchValue({
          title: this.formData.value.title,
          content: this.formData.value.content,
          source: this.formData.value.source,
        });
      }
    }
  }

  private patchFilters(): void {
    this.filters.forEach(filter => {
      if (this.formData.value.tags.includes(filter.name.toLowerCase())) {
        filter.isActive = true;
        this.isArrayEmpty = false;
      }
    });
  }

  public autoResize(event): void {
    const checkTextAreaHeight = event.target.scrollHeight > this.textAreasHeight.minTextAreaScrollHeight
      && event.target.scrollHeight < this.textAreasHeight.maxTextAreaScrollHeight;
    const maxHeight = checkTextAreaHeight ? this.textAreasHeight.maxTextAreaHeight
      : event.target.scrollHeight < this.textAreasHeight.minTextAreaScrollHeight;
    const minHeight = checkTextAreaHeight ? this.textAreasHeight.minTextAreaHeight : `${event.target.scrollHeight}px`;
    event.target.style.height = checkTextAreaHeight ? maxHeight : minHeight;
  }

  public addFilters(filter: FilterModel): void {
    if ( !filter.isActive ) {
      filter.isActive = true;
      this.isArrayEmpty = false;
      this.formGroup.value.tags = [...this.formGroup.value.tags, filter.name.toLowerCase()];
      this.filtersValidation(filter);
    } else {
      this.removeFilters(filter);
    }
  }

  public filtersValidation(filter: FilterModel): void {
    if ( this.formGroup.value.tags.length > 3) {
      this.isFilterValidation = true;
      setTimeout(() => this.isFilterValidation = false, 3000);
      this.formGroup.value.tags = this.formGroup.value.tags.slice(0, 3);
      filter.isActive = false;
    }
  }

  public removeFilters(filter: FilterModel): void {
    const tagsArray = this.formGroup.value.tags;
    if ( filter.isActive && tagsArray.length === 1 ) {
      this.isArrayEmpty = true;
    }
    this.formGroup.value.tags = tagsArray.filter(item => item.toLowerCase() !== filter.name.toLowerCase());
    filter.isActive = false;
  }

  // public onSourceChange(): void {
  //   if (this.formGroup) {
  //     this.formGroup.get('source').valueChanges.subscribe(source => {
  //       this.isLinkOrEmpty = /^$|^https?:\/\//.test(source);
  //     });
  //   }
  // }

  public openCancelPopup(): void {
    this.dialog.open(CancelPopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        currentPage: 'eco news'
      }
    });
  }

  public goToPreview(): void {
    this.createEcoNewsService.setForm(this.formGroup);
    this.router.navigate(['news', 'preview']);
    this.setFilters();
  }

  private setFilters(): void {
    if (this.formData) {
      this.formData.value.tags.forEach(tag => {
        this.filters.forEach(filter => {
          if (filter.name.toLowerCase() === tag &&
            filter.isActive &&
            !this.formGroup.value.tags.includes(tag)) {
            this.formGroup.value.tags = [...this.formGroup.value.tags, tag];
            this.filtersValidation(filter);
          }
        });
      });
    }
  }
}

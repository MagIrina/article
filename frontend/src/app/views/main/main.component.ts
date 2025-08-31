import {Component, OnDestroy, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleType} from "../../../types/article.type";
import {Router} from "@angular/router";
import {ArticlesService} from "../../shared/services/articles.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  autoSlideInterval: any;
  private slidesCount = 3;
  showModal = false;
  defaultService: string | undefined;

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplaySpeed: 300,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false,
  };

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру. '
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: "Светлана",
      image: "review4.png",
      text: "Огромное спасибо команде АйтиШторма за отличный контент! Статьи вдохновляют на создание своего блога и мотивируют двигаться вперёд."
    },
    {
      name: "Елена",
      image: "review5.png",
      text: "Работа с ребятами из АйтиШторма превзошла мои ожидания. Каждый материал выглядит профессионально и вызывает желание делиться информацией дальше!"
    },
    {
      name: "Александра",
      image: "review6.png",
      text: "Благодаря статьям и советам команды АйтиШторма смог вывести своё продвижение на новый уровень. Теперь понимаю важность качественного контента и грамотного позиционирования!"
    },
    {
      name: "Станислав",
      image: "review7.png",
      text: "Очень рада знакомству с командой АйтиШторма! Их материалы помогли разобраться в тонкостях SMM и построения личного бренда. Спасибо вам большое!"
    }
  ];

  articles: ArticleType[] = [];
  loading = false;

  constructor(
    private articlesService: ArticlesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchArticles();

    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  fetchArticles() {
    this.loading = true;
    this.articlesService.getTopArticles()
      .subscribe({
        next: (data: ArticleType[] | ArticleType) => {
          this.articles = Array.isArray(data) ? data : [data];
          this.loading = false;
        },
        error: (err) => {
          console.error('Не удалось загрузить популярные статьи', err);
          this.loading = false;
        }
      });
  }

  openArticle(article: ArticleType): void {
    if (!article) return;
    this.router.navigate(['/blog', article.url]);
  }


  ngOnDestroy() {
    this.pauseAuto();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slidesCount;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slidesCount) % this.slidesCount;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  pauseAuto() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  resumeAuto() {
    if (!this.autoSlideInterval) {
      this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    }
  }

  openModal(service?: string) {
    this.defaultService = service;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}

/* Generos */
export interface Gender {
    _id: string;
    name: string;
    status: number;
    movies?: ResourceMovieM[];
    series?: ResourceMovieM[];
}


/* Generos */
/* Peliculas y Series */

export interface Artist {
    name: string;
}

export interface ResourceMovieM {
    _id: string;
    artists: Artist[];
    description: string;
    director: string;
    genders?: Gender[];
    id_resource?: number;
    landscape_poster_url: string;
    name: string;
    poster_url: string;
    publication_date: string;
    resource_file_name: string;
    resource_file_url: string;
    resource_trailer_file_name: string;
    resource_trailer_file_url: string;
    seasons?: Season[];
    score_average: number;
    status: number;
    thumb: string;
    year: string;
    duration?:string
}

export interface Chapter {
    chapter_number: number;
    description: string;
    landscape_poster_url: string;
    name: string;
    poster_url: string;
    publication_date: string;
    resource_file_name: string;
    resource_file_url: string;
    resource_trailer_file_name: string;
    resource_trailer_file_url: string;
    score_average: number;
    status: number;
    thumb: string;
    type: number;
    year: string;
}

export interface Season {
    chapters: Chapter[];
    description: string;
    name: string;
    publication_date: string;
    score_average: number;
    season_number: number;
    type: number;
    year: string;
}

export interface SliderHome {
    description: string;
    id: number;
    img_url: string;
    link_1: string;
    link_2: string;
    order?:string;
    status: boolean;
    title: string;
}

export interface RespSliderHome {
    data: SliderHome[];
}

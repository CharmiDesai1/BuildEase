import React from "react";
import styles from "./SuggestionPage.module.css";
import { Header } from "./Header";
import { ProjectCard } from "./ProjectCard";
import { SearchBar } from "./SearchBar";
import { ScrollToTop } from "./ScrollToTop";

export function SuggestionPage() {
  return (
    <main className={styles.SuggestionPage}>
      <Header />
      <SearchBar />
      <section className={styles.projectsSection}>
        <ProjectCard
          title="A Shridhar Athens"
          type="Apartment"
          carpetArea="1,000 - 1,065 sq ft"
          status="Under construction"
          bhk="3Bhk"
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/cd168df9fc9d8e92caadcbfc8fc2741793ec03a9f995b843c5e0e8dd5d92ffd7"
        />
        <ProjectCard
          title="A Shridhar Vandemataram"
          type="Apartment"
          carpetArea="1,000 - 1,065 sq ft"
          status="Early Development Stage"
          bhk="3Bhk"
        />
        <ProjectCard
          title="A Shridhar Kaveri-sangam"
          type="Apartment"
          carpetArea="1,000 - 1,065 sq ft"
          status="Early Development stage"
          bhk="3Bhk"
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/9aa320ed7209fa45b53eeb4eca9d55c5ee7bc06b849f155f50626a0914c6bdfa"
        />
        <ProjectCard
          title="A Shridhar Vandemataram"
          type="Apartment"
          carpetArea="1,000 - 1,065 sq ft"
          status="Early Development stage"
          bhk="3Bhk"
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/ab6f8b5952dd2e32b553b95d4548cc7442c25c13553de9d72a91229d2d612705"
        />
      </section>
      <ScrollToTop />
    </main>
  );
}
export default SuggestionPage;
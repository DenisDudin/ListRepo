class View {
  constructor() {
    this.repoContainer = document.getElementById("added-repo-container");
    this.searchInput = document.getElementById("search");
    this.autocomBox = document.getElementById("autocom-box");

    this.repoContainer.addEventListener("click", (e) => {
      if (e.target.className == "repo__del") {
        e.target.parentNode.remove();
      }
      removeEventListener("click", (e) => {});
    });
  }

  createElement(tagElement, classElement, textElement) {
    const element = document.createElement(tagElement);
    if (classElement) {
      classElement.split(" ").forEach((classEleme) => {
        element.classList.add(classEleme);
      });
    }
    if (textElement) {
      element.textContent = textElement;
    }

    return element;
  }

  createSearchOption(repoData) {
    const option = this.createElement("li", "autocom-box__item", repoData.name);
    option.addEventListener("click", () => {
      this.createRepo(repoData);
      this.searchInput.value = "";
      this.autocomBox.innerHTML = "";
    });
    this.autocomBox.appendChild(option);
  }

  createRepo(repoData) {
    const repoElement = this.createElement("div", "repo-container repo");

    const repoInfo = this.createElement("p", "repo__info");
    const repoName = this.createElement(
      "p",
      "repo__name",
      `Name: ${repoData.name}`
    );
    const repoOwner = this.createElement(
      "p",
      "repo__owner",
      `Owner: ${repoData.owner.login}`
    );
    const repoStars = this.createElement(
      "p",
      "repo__stars",
      `Stars: ${repoData.stargazers_count}`
    );
    repoInfo.appendChild(repoName);
    repoInfo.appendChild(repoOwner);
    repoInfo.appendChild(repoStars);

    const btnDel = this.createElement("button", "repo__del");
    btnDel.innerHTML = "&#10060;";

    repoElement.appendChild(repoInfo);
    repoElement.appendChild(btnDel);
    this.repoContainer.appendChild(repoElement);
  }
}

class Search {
  constructor(view) {
    this.view = view;
    this.debouncedHandle = this.debounce(this.serachRepo.bind(this));

    this.view.searchInput.addEventListener("input", this.debouncedHandle);
  }

  debounce(fn, debounceTime = 400) {
    let timer;

    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, debounceTime);
    };
  }

  async serachRepo() {
    return await fetch(
      `https://api.github.com/search/repositories?q=${this.view.searchInput.value}`
    ).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          this.view.autocomBox.innerHTML = "";
          let countRepo = 0;
          while (countRepo < res.items.length && countRepo < 5) {
            console.log(res.items[countRepo]);
            this.view.createSearchOption(res.items[countRepo]);
            countRepo++;
          }
        });
      } else {
      }
    });
  }
}

new Search(new View());

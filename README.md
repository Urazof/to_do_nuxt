# Todo Application

A Todo application built with Nuxt 3 and MongoDB running on Docker.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js](https://nodejs.org/en/download/), [Docker](https://www.docker.com/products/docker-desktop), and [Yarn](https://classic.yarnpkg.com/en/docs/install).

## Installing Todo Application

To install Todo Application, follow these steps:

1. Clone the repository:
   git clone https://github.com/Urazof/to_do_nuxt.git cd to_do_nuxt


2. Start MongoDB Docker container:
   docker run --name todo-mongo -p 27017:27017 -d mongo:latest


3. Install dependencies:
   yarn install


4. Start the application:
   yarn dev


## Using Todo Application

Open your web browser and visit `http://localhost:3000` to start using the Todo Application.

## Project Structure

- `components/`: Contains Vue.js Components.
- `helpers/`: Contains helpers.
- `pages/`: Contains Application Views and Routes.
- `assets/`: Contains un-compiled assets such as images, styles or fonts.
- `db/`: Contains scripts related to MongoDB database.

## Running Tests

To run tests, execute the following command:

yarn test


## Contributing to Todo Application

To contribute to Todo Application, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b `.
3. Make your changes and commit them: `git commit -m ''`
4. Push to the original branch: `git push origin /`
5. Create the pull request.

## License

This project uses the following license: [MIT](https://choosealicense.com/licenses/mit/).

## Contact

If you want to contact me you can reach me at `https://github.com/Urazof/`.

## Acknowledgements

This project was built using these wonderful technologies:

- [Nuxt.js](https://v3.nuxtjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
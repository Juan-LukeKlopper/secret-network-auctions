<style global>
    :root {
      font-family: "Montserrat", "Hind";
      --pure-white: #ffffff;
      --primary-color: #b9c6d2;
      --secondary-color: #d0dde9;
      --tertiary-color: #edf0f8;
      --accent-color: #ff3e00;
      --heading-color: rgba(0, 0, 0, 0.7);
      --text-color: #444444;
      --background-without-opacity: rgba(255, 255, 255, 0.7);
      --column-width: 42rem;
      --column-margin-top: 4rem;
    }
  
    main {
      text-align: center;
      padding: 0 1em 1em 1em;
      margin: 0 auto;
    }
  
    img {
      height: 16rem;
      width: 16rem;
    }
  
    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4rem;
      font-weight: 100;
      line-height: 1.1;
      margin: 2rem auto;
      max-width: 14rem;
    }
  
    body {
      min-height: 100vh;
      margin: 0;
      background-color: var(--primary-color);
      background: linear-gradient(
        180deg,
        var(--primary-color) 0%,
        var(--secondary-color) 10.45%,
        var(--tertiary-color) 41.35%
      );
    }
  
    body::before {
      content: "";
      width: 80vw;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 10vw;
      z-index: -1;
      background: radial-gradient(
        50% 50% at 50% 50%,
        var(--pure-white) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      opacity: 0.05;
    }
  
    #svelte {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    strong{
      color: var(--accent-color);
    }
    .auctions {
      border-radius: 2rem;
      text-align:start;
      margin: 10px;
      padding: 2px 0px 5px 15px;
      outline: var(--text-color) solid 1px ;
    }

    button {
      background-color: var(--primary-color);
      border-color: var(--text-color);
      margin: 1px 5px 5px 1px;
      border-radius: 2rem;
    }

    button:hover{
      background-color: var(--accent-color);
      color: var(--tertiary-color);
    }

    button:active{
      background-color: var(--text-color);
      color: var(--accent-color);
      border-color: var(--primary-color);
    }

    .refreshMessage {
      padding: 1px 2px 2px 1px;
    }
  
    @media (min-width: 480px) {
      h1 {
        max-width: none;
      }
  
      p {
        max-width: none;
      }
    }
</style>
  
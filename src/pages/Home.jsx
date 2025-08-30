import heroImg from '../assets/img/HERO_IMG.jpg'

export function Home() {

    return (
        <section className="home full">
            {<img style={{width:'100vw', height:'100%'}}src={heroImg} alt="home page img" />}
        </section>
    )
}
import "./preloader.css";

export default function Preloader() {
    return (
        <div className="preloader">
            <div className="dog-runner" />

            <>
                <mesh>
                    <planeGeometry args={[2, 2]} />
                    <meshBasicMaterial color="#111" />
                </mesh>

                <EffectComposer>
                    <LiquidEffect />
                </EffectComposer>
            </>
        </div>
    );
}

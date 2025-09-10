(function(){
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries)=>{
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  targets.forEach(t => io.observe(t));
})();


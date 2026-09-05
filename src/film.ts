import QRCode from 'qrcode';

/**
 * Le film, quand il n'est pas la.
 *
 * La video d'Antarctique pese 170 Mo : elle ne tient pas dans le quota de
 * l'hebergement, et elle n'est donc pas toujours en ligne. Un <video> dont la
 * source manque affiche un lecteur casse ; on le remplace alors par un bloc
 * dessine, qui dit ce que c'est et ou le trouver.
 *
 * Le jour ou le fichier est depose, il n'y a rien a changer : le lecteur se
 * charge et ce module ne fait rien.
 */

function placeholder(video: HTMLVideoElement): void {
  const slot = document.createElement('div')
  slot.className = 'photo__slot photo__slot--wide film__missing'
  slot.innerHTML = `
    <svg class="photo__mark" aria-hidden="true"><use href="#vg-manchot" /></svg>
    <span class="photo__hint">Le film &middot; à demander à Erick</span>
  `
  video.replaceWith(slot)
}

export function setupFilm(): void {
  document.querySelectorAll<HTMLVideoElement>('.player').forEach((video) => {
    // `error` sur <video> ne remonte pas : on ecoute en phase de capture.
    video.addEventListener('error', () => placeholder(video), true)

    // Un fichier absent renvoie souvent une page HTML en 404 : le navigateur
    // ne declenche alors pas toujours `error`. On verifie donc aussi que des
    // metadonnees sont bien arrivees.
    window.setTimeout(() => {
      if (video.isConnected && video.readyState === 0) placeholder(video)
    }, 4000)
  })
}

/**
 * Remplace les (de l'antarctique uniquement pour le moment) par des QR code pour le format PDF.
 **/
export async function preparePrintQrCodes(): Promise<void> {
  const images = document.querySelectorAll<HTMLImageElement>('img[data-qr-url]');

  await Promise.all(Array.from(images).map(async (img) => {
        const url = img.dataset.qrUrl;

        console.log(url);
        if (!url) {
          return;
        }

        //Ne regen pas le QR à chaque impression
        if (img.src) {
          return;
        }

        img.src = await QRCode.toDataURL(url, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H',
        });

        console.log("complete")
      }),
  );
}
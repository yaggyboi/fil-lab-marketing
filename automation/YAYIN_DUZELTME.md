# 7–13 Eylül · onaylı yayınların onarımı

7 Eylül canlı kontrolünde 11.30 burç gönderisi yayımlanmamıştı. GitHub Actions geçmişinde o günün çalışması yoktu; eski yerel otomasyon duraklatılmıştı. Tek tetikleyicinin neden çalışmadığı kesinleşmedi. Yeni topluluk setinin kalan içerikleri hiç zamanlanmamıştı.

Kullanıcı 7 Eylül'de burç gönderisinin hemen paylaşılmasını ve kalan yayınların yeniden ayarlanmasını onayladı. Gönderi manuel kurtarma ile yayımlandı: 18391061119166754. Açıklama ve Fil Lab konumu korundu. Bugünün hikâyesi bu doğrulanmış gönderiye bağlıdır.

## Kalan takvim · Türkiye saati

- 8 Salı 13.00: Sana da aldım · hikâye.
- 9 Çarşamba 13.00: Kahve kamerası · art arda 2 hikâye.
- 10 Perşembe 12.30: Bana fark etmez · gönderi. 13.00: ilgili hikâye.
- 11 Cuma 13.00: Ankara'da mevsim sorusu · hikâye.
- 12 Cumartesi 12.30: Aynı cep · gönderi. 13.00: ilgili hikâye.
- 13 Pazar 13.00: Mario yıldönümü ve ilk oyun sorusu · art arda 2 hikâye.

Saatler hedef saatlerdir, en yüksek etkileşim iddiası değildir. GitHub zamanlayıcıları gecikebildiği için saat geldikten sonra tekrarlı kontrol kullanılır. İzin verilen son saat 15.00; kaçan içerik geceye taşınmaz. Gelecek haftanın 14–20 Eylül taslakları bu otomasyona dahil değildir.

## Güvenlik

- Yalnızca ICERIKLER.json içinde daha önce kullanıcı-onaylı işaretlenmiş dosyaların birebir kopyaları kullanıldı.
- Tekil yayın kilidi GitHub üzerindeki codex/instagram-yayin-kayitlari dalına, Meta çağrısından önce yazılır. Anahtarlar kayda girmez.
- Hazırlama veya paylaşım sırasında kesilen işlem otomatik tekrar basılmaz; inceleme gerektirir.
- Başarılı medya kimliği, yayın saati ve doğrulama ayrı kaydedilir. Hikâyeler ilgili gönderi doğrulanmadan yayımlanmaz.
- GitHub ve Meta bağlantıları kontrol kipinde sınanabilir; kontrol kipi hiçbir içerik yayımlamaz.
- Kontrol kipi kayıt dalına yalnızca bağlantı testi sonucunu yazar; buluttan kayıt yazma yetkisi de doğrulanır. Sorunlu bir yayın diğer günlerin bağımsız içeriklerini durdurmaz.
- Eski ve reddedilen haftalık tavsiye seti kullanılmaz. Eski yerel otomasyonlar yeniden etkinleştirilmez.
- Bu dosya tek başına etkin zamanlama kanıtı değildir; kurulum sonrası canlı workflow çalışması ayrıca doğrulanır.

GitHub'ın gecikme uyarısı: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule

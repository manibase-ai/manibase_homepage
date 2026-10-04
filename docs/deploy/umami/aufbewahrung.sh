#!/bin/sh
# Loescht Umami-Messdaten, die aelter als 13 Monate sind (Datenschutzerklaerung,
# Abschnitt 12). Umami selbst kennt keine Aufbewahrungsfrist; Fremdschluessel gibt
# es nicht (Prisma relationMode), daher Reihenfolge und NOT EXISTS hier.
# Liegt unter /opt/umami/aufbewahrung.sh, gestartet von umami-aufbewahrung.timer.
set -eu
cd /opt/umami
docker compose exec -T db psql -U umami -d umami -v ON_ERROR_STOP=1 -q <<'SQL'
begin;
delete from event_data     where created_at < now() - interval '13 months';
delete from session_data   where created_at < now() - interval '13 months';
delete from revenue        where created_at < now() - interval '13 months';
delete from heatmap_event  where created_at < now() - interval '13 months';
delete from session_replay where created_at < now() - interval '13 months';
delete from session_link   where created_at < now() - interval '13 months';
delete from website_event  where created_at < now() - interval '13 months';
delete from session s      where s.created_at < now() - interval '13 months'
  and not exists (select 1 from website_event e where e.session_id = s.session_id);
commit;
SQL
echo "umami-aufbewahrung: Daten vor $(date -u -d '13 months ago' +%F) entfernt"

#!/usr/bin/env bash
set -euo pipefail
cd /workspace

wait_for() {
  local url=$1
  local max=${2:-120}
  local i=0
  while [ "$i" -lt "$max" ]; do
    if curl -sf -o /dev/null --max-time 2 "$url"; then
      return 0
    fi
    i=$((i + 1))
    sleep 1
  done
  echo "Timed out waiting for $url" >&2
  return 1
}

start_tmux_if_down() {
  local session=$1
  local cmd=$2
  if tmux has-session -t "$session" 2>/dev/null; then
    return 0
  fi
  tmux new-session -d -s "$session" "$cmd"
}

if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8082/api/v1/health; then
  start_tmux_if_down pi_backend "npm run backend:dev 2>&1 | tee /tmp/pi-backend.log"
  wait_for http://127.0.0.1:8082/api/v1/health 60
fi

if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  start_tmux_if_down pi_frontend "npm run dev 2>&1 | tee /tmp/pi-frontend.log"
  wait_for http://127.0.0.1:8080/ 180
fi

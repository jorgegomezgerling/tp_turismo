from django.http import JsonResponse
from turismo.utils.redis_client import redis_client
from django.views.decorators.csrf import csrf_exempt
import json

def test_redis(request):
    try:
        pong = redis_client.ping()
        if pong:
            return JsonResponse({'status': 'Conectado a Redis'})
        else:
            return JsonResponse({'status': 'Sin respuesta de Redis'}, status=500)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def agregar_lugar(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            nombre = data['nombre']
            lat = data['lat']
            lon = data['lon']
            grupo = data['grupo']
        except (KeyError, json.JSONDecodeError):
            return JsonResponse({'error': 'Faltan datos o formato inválido'}, status=400)

        grupos_validos = ["cervecerías", "universidades", "farmacias", "emergencias", "supermercados"]
        if grupo not in grupos_validos:
            return JsonResponse({'error': 'Grupo no válido'}, status=400)

        id = redis_client.incr("contador:lugar")

        # Guardar la ubicación geoespacial
        redis_client.geoadd(f"lugares:{grupo}", (lon, lat, f"lugar:{id}"))

        # Guardar los datos adicionales
        redis_client.hset(f"lugar:{id}", mapping={
            "nombre": nombre,
            "grupo": grupo
        })

        return JsonResponse({'status': 'Agregado', 'id': id})

    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def lugares_cercanos(request):
    if request.method == 'GET':
        try:
            lon = float(request.GET.get('lon'))
            lat = float(request.GET.get('lat'))
        except (TypeError, ValueError):
            return JsonResponse({'error': 'Parámetros inválidos o faltantes'}, status=400)

        lugares_cercanos = []
        grupos = ["cervecerías", "universidades", "farmacias", "emergencias", "supermercados"]

        for grupo in grupos:
            resultados = redis_client.geosearch(
                f"lugares:{grupo}",
                longitude=lon,
                latitude=lat,
                radius=5,
                unit='km',
                withdist=True
            )

            for lugar_id, distancia in resultados:
                datos = redis_client.hgetall(lugar_id)
                lugares_cercanos.append({
                    'id': lugar_id.decode(),
                    'nombre': datos.get(b'nombre', b'').decode(),
                    'grupo': datos.get(b'grupo', b'').decode(),
                    'distancia': float(distancia)
                })

        return JsonResponse(lugares_cercanos, safe=False)
    
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


# Paso 1: Leer los parámetros lat, lon y id del request
# Paso 2: Usar Redis para buscar la ubicación del lugar con GEOPOS
# Paso 3: Calcular la distancia entre los dos puntos
# Paso 4: Buscar el nombre del lugar y devolver todo en JSON

@csrf_exempt
def distancia(request):
    if request.method == 'GET':
        try:
            lat = float(request.GET.get('lat'))
            lon = float(request.GET.get('lon'))
            lugar_id = request.GET.get('id')
        except (TypeError, ValueError):
            return JsonResponse({'error': 'Parámetros inválidos o faltantes'}, status=400)

        datos = redis_client.hgetall(lugar_id)
        if not datos:
            return JsonResponse({'error': 'Lugar no encontrado'}, status=404)

        grupo = datos.get(b'grupo', b'').decode()

        # Paso 4: obtener la posición del lugar desde Redis
        posicion = redis_client.geopos(f"lugares:{grupo}", lugar_id)

        lon_lugar, lat_lugar = posicion[0]

        redis_client.geoadd("tmp:medicion", (lon, lat, "usuario"))
        redis_client.geoadd("tmp:medicion", (lon_lugar, lat_lugar, "lugar"))

        distancia = redis_client.geodist("tmp:medicion", "usuario", "lugar", unit="km")

        redis_client.delete("tmp:medicion")

        return JsonResponse({
            'id': lugar_id,
            'nombre': datos.get(b'nombre', b'').decode(),
            'grupo': grupo,
            'distancia': float(distancia) # completar con lo que calcules
        })

    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
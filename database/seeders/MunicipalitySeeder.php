<?php

namespace Database\Seeders;

use App\Models\Municipality;
use Illuminate\Database\Seeder;

class MunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Municipality::insert([
            ['name' => 'AGUADILLA', 'latitude' => 18.428846, 'longitude' => -67.154532, 'is_active' => true],
            ['name' => 'ISABELA', 'latitude' => 18.501924, 'longitude' => -67.024152, 'is_active' => true],
            ['name' => 'QUEBRADILLAS', 'latitude' => 18.472840, 'longitude' => -66.937696, 'is_active' => true],
            ['name' => 'CAMUY', 'latitude' => 18.484701, 'longitude' => -66.846149, 'is_active' => true],
            ['name' => 'HATILLO', 'latitude' => 18.486550, 'longitude' => -66.825338, 'is_active' => true],
            ['name' => 'ARECIBO', 'latitude' => 18.472149, 'longitude' => -66.716906, 'is_active' => true],
            ['name' => 'BARCELONETA', 'latitude' => 18.452651, 'longitude' => -66.539259, 'is_active' => true],
            ['name' => 'MANATI', 'latitude' => 18.429068, 'longitude' => -66.489155, 'is_active' => true],
            ['name' => 'VEGA BAJA', 'latitude' => 18.444435, 'longitude' => -66.387017, 'is_active' => true],
            ['name' => 'VEGA ALTA', 'latitude' => 18.412032, 'longitude' => -66.328970, 'is_active' => true],
            ['name' => 'DORADO', 'latitude' => 18.460314, 'longitude' => -66.264772, 'is_active' => true],
            ['name' => 'TOA ALTA', 'latitude' => 18.388668, 'longitude' => -66.248126, 'is_active' => true],
            ['name' => 'TOA BAJA', 'latitude' => 18.443866, 'longitude' => -66.181048, 'is_active' => true],
            ['name' => 'CATAÑO', 'latitude' => 18.441034, 'longitude' => -66.118793, 'is_active' => true],
            ['name' => 'BAYAMON', 'latitude' => 18.399579, 'longitude' => -66.155270, 'is_active' => true],
            ['name' => 'GUAYNABO', 'latitude' => 18.357372, 'longitude' => -66.111230, 'is_active' => true],
            ['name' => 'TRUJILLO ALTO', 'latitude' => 18.354012, 'longitude' => -66.006912, 'is_active' => true],
            ['name' => 'CAROLINA', 'latitude' => 18.381574, 'longitude' => -65.955577, 'is_active' => true],
            ['name' => 'LOIZA', 'latitude' => 18.427477, 'longitude' => -65.885187, 'is_active' => true],
            ['name' => 'RIO GRANDE', 'latitude' => 18.336823, 'longitude' => -67.236396, 'is_active' => true],
            ['name' => 'LUQUILLO', 'latitude' => 18.375763, 'longitude' => -65.715598, 'is_active' => true],
            ['name' => 'FAJARDO', 'latitude' => 18.324282, 'longitude' => -65.652875, 'is_active' => true],
            ['name' => 'RINCON', 'latitude' => 18.336823, 'longitude' => -67.236396, 'is_active' => true],
            ['name' => 'AGUADA', 'latitude' => 18.380311, 'longitude' => -67.190127, 'is_active' => true],
            ['name' => 'MOCA', 'latitude' => 18.394966, 'longitude' => -66.407325, 'is_active' => true],
            ['name' => 'AÑASCO', 'latitude' => 18.283128, 'longitude' => -67.140668, 'is_active' => true],
            ['name' => 'MAYAGUEZ', 'latitude' => 18.201478, 'longitude' => -67.139192, 'is_active' => true],
            ['name' => 'SAN SEBASTIAN', 'latitude' => 18.336509, 'longitude' => -66.990770, 'is_active' => true],
            ['name' => 'LAS MARIAS', 'latitude' => 18.246416, 'longitude' => -66.994358, 'is_active' => true],
            ['name' => 'MARICAO', 'latitude' => 18.180456, 'longitude' => -66.979602, 'is_active' => true],
            ['name' => 'LARES', 'latitude' => 18.295914, 'longitude' => -66.877395, 'is_active' => true],
            ['name' => 'ADJUNTAS', 'latitude' => 18.16204, 'longitude' => -66.723160, 'is_active' => true],
            ['name' => 'UTUADO', 'latitude' => 18.264964, 'longitude' => -66.700726, 'is_active' => true],
            ['name' => 'JAYUYA', 'latitude' => 18.218705, 'longitude' => -66.592064, 'is_active' => true],
            ['name' => 'CIALES', 'latitude' => 18.336498, 'longitude' => -66.468142, 'is_active' => true],
            ['name' => 'MOROVIS', 'latitude' => 18.325991, 'longitude' => -66.407325, 'is_active' => true],
            ['name' => 'OROCOVIS', 'latitude' => 18.226941, 'longitude' => -66.391222, 'is_active' => true],
            ['name' => 'COROZAL', 'latitude' => 18.340701, 'longitude' => -66.317203, 'is_active' => true],
            ['name' => 'BARRANQUITAS', 'latitude' => 18.188600, 'longitude' => -66.315426, 'is_active' => true],
            ['name' => 'NARANJITO', 'latitude' => 18.284744, 'longitude' => -66.250978, 'is_active' => true],
            ['name' => 'COMERIO', 'latitude' => 18.218284, 'longitude' => -66.226855, 'is_active' => true],
            ['name' => 'CIDRA', 'latitude' => 18.175614, 'longitude' => -66.160792, 'is_active' => true],
            ['name' => 'AGUAS BUENAS', 'latitude' => 18.256840, 'longitude' => -66.103767, 'is_active' => true],
            ['name' => 'CAGUAS', 'latitude' => 18.234500, 'longitude' => -66.035118, 'is_active' => true],
            ['name' => 'GURABO', 'latitude' => 18.254842, 'longitude' => -65.972887, 'is_active' => true],
            ['name' => 'SAN LORENZO', 'latitude' => 18.189028, 'longitude' => -65.961335, 'is_active' => true],
            ['name' => 'JUNCOS', 'latitude' => 18.227427, 'longitude' => -65.922677, 'is_active' => true],
            ['name' => 'LAS PIEDRAS', 'latitude' => 18.182497, 'longitude' => -65.865207, 'is_active' => true],
            ['name' => 'HUMACAO', 'latitude' => 18.150164, 'longitude' => -65.826097, 'is_active' => true],
            ['name' => 'NAGUABO', 'latitude' => 18.211366, 'longitude' => -65.735007, 'is_active' => true],
            ['name' => 'CEIBA', 'latitude' => 18.263781, 'longitude' => -65.647718, 'is_active' => true],
            ['name' => 'HORMIGUEROS', 'latitude' => 18.140068, 'longitude' => -67.127749, 'is_active' => true],
            ['name' => 'CABO ROJO', 'latitude' => 18.087038, 'longitude' => -67.145935, 'is_active' => true],
            ['name' => 'SAN GERMAN', 'latitude' => 18.082059, 'longitude' => -67.041917, 'is_active' => true],
            ['name' => 'LAJAS', 'latitude' => 18.049621, 'longitude' => -67.059086, 'is_active' => true],
            ['name' => 'SABANA GRANDE', 'latitude' => 18.379591, 'longitude' => -65.831090, 'is_active' => true],
            ['name' => 'GUANICA', 'latitude' => 17.968791, 'longitude' => -66.90599, 'is_active' => true],
            ['name' => 'YAUCO', 'latitude' => 18.034108, 'longitude' => -66.849097, 'is_active' => true],
            ['name' => 'GUAYANILLA', 'latitude' => 18.017500, 'longitude' => -66.789162, 'is_active' => true],
            ['name' => 'PEÑUELAS', 'latitude' => 18.056738, 'longitude' => -66.721711, 'is_active' => true],
            ['name' => 'PONCE', 'latitude' => 18.011071, 'longitude' => -66.614063, 'is_active' => true],
            ['name' => 'JUANA DIAZ', 'latitude' => 18.052541, 'longitude' => -66.505893, 'is_active' => true],
            ['name' => 'VILLALBA', 'latitude' => 18.128142, 'longitude' => -66.492479, 'is_active' => true],
            ['name' => 'COAMO', 'latitude' => 18.080341, 'longitude' => -66.356355, 'is_active' => true],
            ['name' => 'SANTA ISABEL', 'latitude' => 17.965203, 'longitude' => -66.404138, 'is_active' => true],
            ['name' => 'AIBONITO', 'latitude' => 18.139451, 'longitude' => -66.266274, 'is_active' => true],
            ['name' => 'SALINAS', 'latitude' => 17.977104, 'longitude' => -66.297654, 'is_active' => true],
            ['name' => 'CAYEY', 'latitude' => 18.112810, 'longitude' => -66.166196, 'is_active' => true],
            ['name' => 'GUAYAMA', 'latitude' => 17.973771, 'longitude' => -66.113231, 'is_active' => true],
            ['name' => 'ARROYO', 'latitude' => 17.964457, 'longitude' => -66.061137, 'is_active' => true],
            ['name' => 'PATILLAS', 'latitude' => 18.005749, 'longitude' => -66.014214, 'is_active' => true],
            ['name' => 'MAUNABO', 'latitude' => 18.006767, 'longitude' => -65.535000, 'is_active' => true],
            ['name' => 'YABUCOA', 'latitude' => 18.050276, 'longitude' => -65.878444, 'is_active' => true],
            ['name' => 'VIEQUES', 'latitude' => 18.148632, 'longitude' => -65.442542, 'is_active' => true],
            ['name' => 'CULEBRA', 'latitude' => 18.310351, 'longitude' => -65.303426, 'is_active' => true],
            ['name' => 'SAN JUAN', 'latitude' => 18.465783, 'longitude' => -66.115657, 'is_active' => true],
            ['name' => 'CANOVANAS', 'latitude' => 18.378481, 'longitude' => -65.899356, 'is_active' => true],
            ['name' => 'FLORIDA', 'latitude' => 18.362863, 'longitude' => -66.566066, 'is_active' => true],
            ['name' => ' Without Municipality', 'latitude' => 18.15, 'longitude' => -66.30, 'is_active' => true],
        ]);
    }
}

